import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { PurchaseProduct, NavigationStackParamList } from '@/types';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import Button from '@/components/Button';
import PurchaseService from '@/services/purchaseService';

interface StoreScreenProps {
  navigation: NavigationProp<NavigationStackParamList>;
}

// Mock products data
const MOCK_PRODUCTS: PurchaseProduct[] = [
  {
    identifier: 'asia_unlock',
    productId: 'com.geoguesser.asia',
    title: 'Asia Continent',
    description: 'Unlock all Asian countries and test your knowledge of the world\'s largest continent.',
    price: '$2.99',
    continent: 'Asia',
  },
  {
    identifier: 'africa_unlock',
    productId: 'com.geoguesser.africa',
    title: 'Africa Continent',
    description: 'Explore the diverse countries of Africa in this challenging geography quiz.',
    price: '$2.99',
    continent: 'Africa',
  },
  {
    identifier: 'north_america_unlock',
    productId: 'com.geoguesser.north_america',
    title: 'North America Continent',
    description: 'From Canada to Costa Rica, test your knowledge of North American geography.',
    price: '$1.99',
    continent: 'North America',
  },
  {
    identifier: 'south_america_unlock',
    productId: 'com.geoguesser.south_america',
    title: 'South America Continent',
    description: 'Challenge yourself with the countries of South America.',
    price: '$1.99',
    continent: 'South America',
  },
  {
    identifier: 'oceania_unlock',
    productId: 'com.geoguesser.oceania',
    title: 'Oceania Continent',
    description: 'Discover the island nations and territories of Oceania.',
    price: '$0.99',
    continent: 'Oceania',
  },
  {
    identifier: 'all_world_unlock',
    productId: 'com.geoguesser.all_world',
    title: 'All World Bundle',
    description: 'Unlock all continents and the ultimate All World challenge mode. Best value!',
    price: '$9.99',
  },
];

const StoreScreen: React.FC<StoreScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [ownedProducts, setOwnedProducts] = useState<Set<string>>(new Set(['europe']));

  const purchaseService = PurchaseService.getInstance();

  useEffect(() => {
    loadProducts();
    checkOwnedProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // In a real app, this would fetch from RevenueCat
      setProducts(MOCK_PRODUCTS);
    } catch (error) {
      console.error('Failed to load products:', error);
      Alert.alert('Error', 'Failed to load store products');
    } finally {
      setLoading(false);
    }
  };

  const checkOwnedProducts = async () => {
    try {
      // In a real app, this would check actual entitlements
      // For now, just Europe is free
      setOwnedProducts(new Set(['europe']));
    } catch (error) {
      console.error('Failed to check owned products:', error);
    }
  };

  const handlePurchase = async (product: PurchaseProduct) => {
    try {
      setPurchasing(product.identifier);
      
      // Mock purchase confirmation
      Alert.alert(
        'Confirm Purchase',
        `Purchase ${product.title} for ${product.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy',
            onPress: async () => {
              // Simulate purchase
              setTimeout(() => {
                Alert.alert(
                  'Purchase Successful',
                  `${product.title} has been unlocked! (Mock purchase)`,
                  [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
                setOwnedProducts(prev => new Set([...prev, product.continent?.toLowerCase() || product.identifier]));
              }, 1000);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Purchase failed:', error);
      Alert.alert('Error', 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      Alert.alert('Restore Purchases', 'Purchases restored! (Mock)');
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      Alert.alert('Error', 'Failed to restore purchases');
    }
  };

  const getContinentEmoji = (continent?: string): string => {
    const emojiMap: Record<string, string> = {
      Asia: '🌏',
      Africa: '🌍',
      'North America': '🌎',
      'South America': '🌎',
      Oceania: '🌴',
    };
    return emojiMap[continent || ''] || '🌍';
  };

  const isProductOwned = (product: PurchaseProduct): boolean => {
    const key = product.continent?.toLowerCase() || product.identifier;
    return ownedProducts.has(key);
  };

  const renderProduct = (product: PurchaseProduct) => {
    const isOwned = isProductOwned(product);
    const isPurchasing = purchasing === product.identifier;

    return (
      <View key={product.identifier} style={styles.productCard}>
        <View style={styles.productHeader}>
          <Text style={styles.productEmoji}>
            {product.continent ? getContinentEmoji(product.continent) : '🌍'}
          </Text>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>
          {isOwned && (
            <View style={styles.ownedBadge}>
              <Text style={styles.ownedText}>Owned</Text>
            </View>
          )}
        </View>

        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <Button
            title={isOwned ? 'Owned' : 'Purchase'}
            onPress={() => handlePurchase(product)}
            variant={isOwned ? 'secondary' : 'accent'}
            size="medium"
            disabled={isOwned}
            loading={isPurchasing}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading store...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="small"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Store</Text>
          <Text style={styles.subtitle}>Unlock new continents</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.freeSection}>
          <View style={styles.freeBanner}>
            <Text style={styles.freeEmoji}>🆓</Text>
            <View style={styles.freeInfo}>
              <Text style={styles.freeTitle}>Europe - FREE</Text>
              <Text style={styles.freeDescription}>
                Start your geography journey with Europe, completely free!
              </Text>
            </View>
            <View style={styles.ownedBadge}>
              <Text style={styles.ownedText}>Included</Text>
            </View>
          </View>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Premium Continents</Text>
          {products.map(renderProduct)}
        </View>

        <View style={styles.restoreSection}>
          <Button
            title="Restore Purchases"
            onPress={handleRestorePurchases}
            variant="outline"
            size="medium"
            fullWidth
          />
          <Text style={styles.restoreText}>
            Already purchased? Restore your purchases to unlock content.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All purchases are one-time only. No subscriptions or recurring charges.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.body,
    color: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.heading,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xxl,
  },
  freeSection: {
    marginBottom: SIZES.xl,
  },
  freeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 16,
    padding: SIZES.lg,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  freeEmoji: {
    fontSize: 32,
    marginRight: SIZES.md,
  },
  freeInfo: {
    flex: 1,
  },
  freeTitle: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  freeDescription: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.white,
    opacity: 0.9,
  },
  productsSection: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.heading,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.lg,
  },
  productCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  productEmoji: {
    fontSize: 32,
    marginRight: SIZES.md,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  productDescription: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    lineHeight: SIZES.lg,
  },
  ownedBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  ownedText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.white,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: SIZES.title,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
  },
  restoreSection: {
    marginBottom: SIZES.xl,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginTop: SIZES.md,
    opacity: 0.8,
  },
  footer: {
    paddingVertical: SIZES.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: SIZES.md,
  },
});

export default StoreScreen;
