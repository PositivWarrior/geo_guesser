import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { OpenAI } from 'openai';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai?.key || process.env.OPENAI_API_KEY,
});

interface PurchaseVerificationRequest {
  userId: string;
  receipt: string;
  productId: string;
}

interface TimerPauseRequest {
  userId: string;
  gameMode: string;
  gameState: any;
  remoteConfig: any;
}

/**
 * Verifies IAP receipts and updates user entitlements
 */
export const verifyPurchase = functions.https.onCall(
  async (data: PurchaseVerificationRequest, context) => {
    try {
      // Ensure user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'User must be authenticated to verify purchases.'
        );
      }

      const { userId, receipt, productId } = data;

      // In a real implementation, you would:
      // 1. Verify the receipt with Apple/Google servers
      // 2. Check if the purchase is valid and not already consumed
      // 3. Update user entitlements in Firestore

      // For this demo, we'll simulate verification
      const isValidReceipt = receipt && receipt.length > 0;
      
      if (isValidReceipt) {
        // Update user's entitlements in Firestore
        const userRef = admin.firestore().collection('users').doc(userId);
        
        // Determine which continent to unlock based on product ID
        const continentMap: Record<string, string> = {
          'com.geoguesser.asia': 'Asia',
          'com.geoguesser.africa': 'Africa',
          'com.geoguesser.north_america': 'North America',
          'com.geoguesser.south_america': 'South America',
          'com.geoguesser.oceania': 'Oceania',
          'com.geoguesser.all_world': 'All World',
        };

        const continent = continentMap[productId];
        
        if (continent) {
          await userRef.update({
            unlockedModes: admin.firestore.FieldValue.arrayUnion(continent),
            purchases: admin.firestore.FieldValue.arrayUnion({
              productId,
              purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
              verified: true,
            }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`Verified purchase for user ${userId}: ${productId} -> ${continent}`);
        }

        return { isValid: true, continent };
      }

      return { isValid: false };
    } catch (error) {
      console.error('Purchase verification failed:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Purchase verification failed'
      );
    }
  }
);

/**
 * LLM-powered evaluation of whether timer pause should be allowed
 */
export const evaluateTimerPause = functions.https.onCall(
  async (data: TimerPauseRequest, context) => {
    try {
      // Ensure user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'User must be authenticated to evaluate timer pause.'
        );
      }

      const { userId, gameMode, gameState, remoteConfig } = data;

      // Create a prompt for the LLM to evaluate timer pause logic
      const prompt = `
You are an AI assistant helping to determine if a timer pause should be allowed in a geography quiz game.

Game Context:
- Mode: ${gameMode}
- Current game state: ${JSON.stringify(gameState, null, 2)}
- Remote config settings: ${JSON.stringify(remoteConfig, null, 2)}

Rules to consider:
1. Timer pausing should generally be allowed for accessibility and user experience
2. In competitive modes or challenges, pausing might be restricted
3. Remote config can override default behavior
4. Consider if the user has shown patterns of abuse

Based on the current remote config and game state, should timer pausing be allowed?

Respond with a JSON object containing:
{
  "allowPause": boolean,
  "reasoning": "Brief explanation of the decision"
}
`;

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that makes decisions about game mechanics based on provided context. Always respond with valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 200,
          temperature: 0.1,
        });

        const responseText = completion.choices[0]?.message?.content;
        
        if (responseText) {
          try {
            const decision = JSON.parse(responseText);
            
            // Log the decision for monitoring
            console.log(`Timer pause decision for user ${userId}:`, decision);
            
            // Store the decision in Firestore for analytics
            await admin.firestore().collection('timerPauseDecisions').add({
              userId,
              gameMode,
              decision: decision.allowPause,
              reasoning: decision.reasoning,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
              gameState: gameState,
            });

            return {
              allowPause: decision.allowPause || true, // Default to allowing pause
              reasoning: decision.reasoning,
            };
          } catch (parseError) {
            console.error('Failed to parse LLM response:', parseError);
            // Fallback to default behavior
            return { allowPause: true, reasoning: 'Default behavior due to parsing error' };
          }
        }
      } catch (llmError) {
        console.error('LLM request failed:', llmError);
        // Fallback to remote config or default
      }

      // Fallback: use remote config or default to allowing pause
      const allowPause = remoteConfig?.gameSettings?.allowTimerPause ?? true;
      
      return {
        allowPause,
        reasoning: 'Using remote config or default setting',
      };
    } catch (error) {
      console.error('Timer pause evaluation failed:', error);
      // In case of any error, default to allowing pause for better UX
      return {
        allowPause: true,
        reasoning: 'Error occurred, defaulting to allowing pause',
      };
    }
  }
);

/**
 * Sync user achievements and statistics
 */
export const syncUserData = functions.https.onCall(
  async (data: { userId: string; achievements: any[]; statistics: any }, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'User must be authenticated to sync data.'
        );
      }

      const { userId, achievements, statistics } = data;
      const userRef = admin.firestore().collection('users').doc(userId);

      await userRef.update({
        achievements,
        statistics,
        lastSyncAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('User data sync failed:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to sync user data'
      );
    }
  }
);

/**
 * Handle user creation and initialization
 */
export const initializeUser = functions.auth.user().onCreate(async (user) => {
  try {
    const userRef = admin.firestore().collection('users').doc(user.uid);
    
    await userRef.set({
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      achievements: [],
      unlockedModes: ['Europe'], // Europe is free
      statistics: {
        totalGamesPlayed: 0,
        totalCorrectGuesses: 0,
        bestTimes: {},
        completionRates: {},
      },
      purchases: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Initialized user profile for ${user.uid}`);
  } catch (error) {
    console.error('Failed to initialize user:', error);
  }
});

/**
 * Cleanup user data on account deletion
 */
export const cleanupUser = functions.auth.user().onDelete(async (user) => {
  try {
    const userRef = admin.firestore().collection('users').doc(user.uid);
    await userRef.delete();
    
    console.log(`Cleaned up user data for ${user.uid}`);
  } catch (error) {
    console.error('Failed to cleanup user data:', error);
  }
});
