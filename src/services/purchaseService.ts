import Purchases, { 
  PurchasesOffering, 
  PurchasesPackage, 
  CustomerInfo,
  PurchasesError,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { IAP_PRODUCT_IDS } from '@/utils/constants';
import { PurchaseProduct } from '@/types';
import FirebaseService from './firebaseService';

class PurchaseService {
  private static instance: PurchaseService;
  private firebaseService: FirebaseService;

  private constructor() {
    this.firebaseService = FirebaseService.getInstance();
  }

  public static getInstance(): PurchaseService {
    if (!PurchaseService.instance) {
      PurchaseService.instance = new PurchaseService();
    }
    return PurchaseService.instance;
  }

  async initialize(apiKey: string): Promise<void> {
    try {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey });
      } else {
        await Purchases.configure({ apiKey });
      }
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async setUserId(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
    } catch (error) {
      console.error('Failed to set user ID:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<PurchaseProduct[]> {
    try {
      const offerings = await Purchases.getOfferings();
      const products: PurchaseProduct[] = [];

      if (offerings.current) {
        offerings.current.availablePackages.forEach((pkg: PurchasesPackage) => {
          const continent = this.getProductContinent(pkg.identifier);
          products.push({
            identifier: pkg.identifier,
            productId: pkg.product.identifier,
            title: pkg.product.title,
            description: pkg.product.description,
            price: pkg.product.priceString,
            continent,
          });
        });
      }

      return products;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return [];
    }
  }

  async purchaseProduct(productIdentifier: string, userId: string): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings();
      
      if (!offerings.current) {
        throw new Error('No offerings available');
      }

      const packageToPurchase = offerings.current.availablePackages.find(
        (pkg: PurchasesPackage) => pkg.identifier === productIdentifier
      );

      if (!packageToPurchase) {
        throw new Error('Product not found');
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      // Verify purchase with Firebase
      const receipt = await this.getReceiptData();
      const isVerified = await this.firebaseService.verifyPurchase(
        userId,
        receipt,
        packageToPurchase.product.identifier
      );

      if (isVerified && customerInfo.entitlements.active[productIdentifier]) {
        // Unlock the continent in Firebase
        const continent = this.getProductContinent(productIdentifier);
        if (continent) {
          await this.firebaseService.unlockContinent(userId, continent);
        }
        return true;
      }

      return false;
    } catch (error) {
      if (error instanceof PurchasesError) {
        if (error.userCancelled) {
          console.log('User cancelled purchase');
          return false;
        }
      }
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(userId: string): Promise<string[]> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const unlockedContinents: string[] = [];

      for (const [entitlementId, entitlement] of Object.entries(customerInfo.entitlements.active)) {
        if (entitlement.isActive) {
          const continent = this.getProductContinent(entitlementId);
          if (continent) {
            unlockedContinents.push(continent);
            await this.firebaseService.unlockContinent(userId, continent);
          }
        }
      }

      return unlockedContinents;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return [];
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async checkEntitlements(): Promise<Record<string, boolean>> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const entitlements: Record<string, boolean> = {};

      Object.keys(IAP_PRODUCT_IDS).forEach((key) => {
        const productId = IAP_PRODUCT_IDS[key as keyof typeof IAP_PRODUCT_IDS];
        entitlements[key] = customerInfo.entitlements.active[productId]?.isActive || false;
      });

      return entitlements;
    } catch (error) {
      console.error('Failed to check entitlements:', error);
      return {};
    }
  }

  private getProductContinent(productIdentifier: string): string | undefined {
    const continentMap: Record<string, string> = {
      [IAP_PRODUCT_IDS.ASIA]: 'Asia',
      [IAP_PRODUCT_IDS.AFRICA]: 'Africa',
      [IAP_PRODUCT_IDS.NORTH_AMERICA]: 'North America',
      [IAP_PRODUCT_IDS.SOUTH_AMERICA]: 'South America',
      [IAP_PRODUCT_IDS.OCEANIA]: 'Oceania',
      [IAP_PRODUCT_IDS.ALL_WORLD]: 'All World',
    };

    return continentMap[productIdentifier];
  }

  private async getReceiptData(): Promise<string> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.originalPurchaseDate || '';
    } catch (error) {
      console.error('Failed to get receipt data:', error);
      return '';
    }
  }
}

export default PurchaseService;
