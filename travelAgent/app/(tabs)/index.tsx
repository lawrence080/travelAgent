import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const filters = [
  'Weekend trip',
  'Next month',
  'Family-friendly',
  'Under $1500',
];

const plans = [
  {
    id: '1',
    destination: 'Paris, France',
    dates: 'Sep 12 – Sep 20',
    status: 'Draft',
    accent: '#FFE6C6',
    accentDot: '#FFB76B',
  },
  {
    id: '2',
    destination: 'Tokyo, Japan',
    dates: 'Oct 03 – Oct 10',
    status: 'Planned',
    accent: '#D9ECFF',
    accentDot: '#6BB1FF',
  },
];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const { height } = useWindowDimensions();

  const contentInset = useMemo(
    () => ({ top: 0, bottom: 24, left: 0, right: 0 }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentInset={contentInset}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              <Image
                source={require('@/assets/images/logo-without-word.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <Text style={styles.brandName}>GooseTravel</Text>
          </View>
        </View>

        <Text style={styles.heading}>Where are we going next?</Text>
        <Text style={styles.subheading}>
          Tell me your destination and dates in one sentence.
        </Text>

        <View style={styles.promptCard}>
          <TextInput
            placeholder="e.g. I want to go to Tokyo in March for 7 days"
            placeholderTextColor="#8F9BB3"
            multiline
            style={[styles.promptInput, { minHeight: height * 0.25 }]}
            textAlignVertical="top"
          />
          <View style={styles.filterRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChips}>
              {filters.map((label) => {
                const selected = activeFilter === label;
                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setActiveFilter(label)}
                    style={[styles.chip, selected && styles.chipActive]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}>
                    <Text style={[styles.chipLabel, selected && styles.chipLabelActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.sendButton} accessibilityRole="button">
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.plansHeader}>
          <Text style={styles.plansTitle}>Your Plans</Text>
          <TouchableOpacity accessibilityRole="button">
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <View style={[styles.planCard, { backgroundColor: item.accent }]}
              accessibilityRole="button">
              <View style={styles.planLeft}>
                <View style={[styles.statusDot, { backgroundColor: item.accentDot }]} />
              </View>
              <View style={styles.planDetails}>
                <View style={styles.planHeaderRow}>
                  <Text style={styles.planDestination}>{item.destination}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#FFF5E8' }]}>
                    <Text style={styles.statusLabel}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.planDates}>{item.dates}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#0F172A" />
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7F1',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF0D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE6C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
  },
  subheading: {
    fontSize: 14,
    color: '#475467',
    lineHeight: 20,
  },
  promptCard: {
    backgroundColor: '#FFFCF8',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#F2D1AE',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  promptInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderColor: '#F3E8DD',
    borderWidth: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2E8DD',
  },
  chipActive: {
    backgroundColor: '#FFE6C6',
    borderColor: '#FFC27A',
  },
  chipLabel: {
    fontSize: 13,
    color: '#475467',
    fontWeight: '600',
  },
  chipLabelActive: {
    color: '#0F172A',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FF8A4C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F2D1AE',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  plansHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8A4C',
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 199, 134, 0.3)',
  },
  planLeft: {
    width: 10,
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  planDetails: {
    flex: 1,
    gap: 4,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  planDestination: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF8A4C',
  },
  planDates: {
    fontSize: 14,
    color: '#475467',
    fontWeight: '600',
  },
});
