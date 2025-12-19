import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const initialProfile = {
  name: 'Jane Doe',
  gender: 'Female',
  age: '24',
  address: '123 Main St, Anytown, USA',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState(initialProfile);
  const [editingField, setEditingField] = useState<keyof typeof initialProfile | null>(null);

  const paymentCard = useMemo(
    () => ({
      brand: 'VISA',
      last4: '4242',
      label: 'Default',
      gradient: ['#E4EDFB', '#E4EDFB'],
    }),
    []
  );

  const handleChange = (field: keyof typeof initialProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const InfoValue = ({ field }: { field: keyof typeof initialProfile }) => {
    const isEditing = editingField === field;

    if (isEditing) {
      return (
        <TextInput
          value={profile[field]}
          onChangeText={(text) => handleChange(field, text)}
          style={styles.input}
          autoFocus
          placeholder={field === 'address' ? 'Enter your address' : undefined}
        />
      );
    }

    return <Text style={styles.infoValue}>{profile[field]}</Text>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>

        <TouchableOpacity>
            <View style={styles.setupButton}>
              <Ionicons name="pencil" size={16} color="#FF8A4C" />
            </View>
        </TouchableOpacity>
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.meta}>{`${profile.gender} · ${profile.age}`}</Text>
        <Text style={styles.address}>{profile.address}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Info</Text>
          <View style={styles.divider} />

          {(Object.keys(profile) as Array<keyof typeof initialProfile>).map((field) => (
            <View key={field} style={styles.infoRow}>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <InfoValue field={field} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandText}>{paymentCard.brand}</Text>
              </View>
              <Text style={styles.cardNumber}>•••• {paymentCard.last4}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{paymentCard.label}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.addPaymentButton} accessibilityRole="button">
            <Ionicons name="add" size={18} color="#FF8A4C" />
            <Text style={styles.addPaymentText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7F1',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  avatarWrap: {
    marginTop: 12,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFE0C9',
    backgroundColor: '#FFEEDD',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  meta: {
    fontSize: 16,
    color: '#8F9BB3',
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#8F9BB3',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2E7DB',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  setupButton: {
    marginTop: 12,
    height: 48,
    // set the button to to right corner of the screen
    position: 'relative',
    right: -100,
    borderRadius: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3E8DD',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#8F9BB3',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  input: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FFE0C9',
    borderRadius: 10,
    backgroundColor: '#FFF8F3',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF2E8',
    marginLeft: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EAF0FE',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D9E3FA',
    marginTop: 12,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F5',
  },
  brandText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  tag: {
    backgroundColor: '#14339D',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  addPaymentButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FF8A4C',
    backgroundColor: '#FFF7F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPaymentText: {
    color: '#FF8A4C',
    fontWeight: '700',
    fontSize: 15,
  },
});