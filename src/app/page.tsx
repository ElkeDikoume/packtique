'use client'

import { useState } from 'react'
import Landing from '@/components/screens/Landing'
import BoardingPassUpload from '@/components/screens/BoardingPassUpload'
import TripSetupLoading from '@/components/screens/TripSetupLoading'
import PackingList from '@/components/screens/PackingList'
import BagSelector from '@/components/screens/BagSelector'
import Confirmation from '@/components/screens/Confirmation'
import { TripData, PackingItem } from '@/lib/bedrock'

type Screen = 'landing' | 'upload' | 'loading' | 'packing' | 'bags' | 'confirmation'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [packingItems, setPackingItems] = useState<PackingItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [tripId, setTripId] = useState<string | null>(null)
  const [selectedBag, setSelectedBag] = useState('')
  const [serviceTier, setServiceTier] = useState<'explorer' | 'concierge'>('explorer')
  const [error, setError] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  // Step 1: Landing → upload
  function handleStart() {
    setCurrentScreen('upload')
    setError(null)
  }

  // Step 2: Upload → call API → packing list
  async function handleBoardingPassSubmit(file: File | null, text: string | null) {
    setCurrentScreen('loading')
    setError(null)

    try {
      const formData = new FormData()
      if (file) {
        formData.append('file', file)
      } else if (text) {
        formData.append('text', text)
      } else {
        throw new Error('No boarding pass content provided')
      }

      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error ?? `API error ${res.status}`)
      }

      const data = await res.json() as { trip: TripData; items: PackingItem[] }
      setTripData(data.trip)
      setPackingItems(data.items)
      setCurrentScreen('packing')
    } catch (err) {
      console.error('Extract failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to extract boarding pass. Please try again.')
      setCurrentScreen('upload')
    }
  }

  // Step 3: Packing list → bag selector
  function handlePackingListNext(items: PackingItem[]) {
    setPackingItems(items)
    setCurrentScreen('bags')
  }

  // Step 4: Bag selector → save → confirmation
  async function handleBagSelectorNext(
    email: string,
    bagBrand: string,
    bagModel: string,
    tier: 'explorer' | 'concierge'
  ) {
    setServiceTier(tier)
    setSelectedBag(`${bagBrand} ${bagModel}`)
    setSavingOrder(true)
    setError(null)

    try {
      // Save trip + items to DB
      const tripBody = {
        email,
        trip: tripData ?? {
          airline: null, flight_number: null, origin: null, destination: null,
          depart_date: null, return_date: null, fare_class: null,
          checked_bag_kg: null, carry_on_kg: null, trip_purpose: null,
        },
        items: packingItems,
      }

      const tripRes = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripBody),
      })

      let savedUserId: string | null = null
      let savedTripId: string | null = null

      if (tripRes.ok) {
        const saved = await tripRes.json() as { userId: string; tripId: string }
        savedUserId = saved.userId
        savedTripId = saved.tripId
        setUserId(savedUserId)
        setTripId(savedTripId)

        // Build category counts for style profile
        const categoryCounts: Record<string, number> = {}
        for (const item of packingItems) {
          categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1
        }

        // Save style profile
        const profileBody = {
          userId: savedUserId,
          tripId: savedTripId,
          destination: tripData?.destination ?? '',
          season: getSeason(tripData?.depart_date),
          trip_purpose: tripData?.trip_purpose ?? 'Leisure',
          bag_brand: bagBrand,
          bag_model: bagModel,
          service_tier: tier === 'explorer' ? 'Explorer' : 'Concierge',
          item_categories: categoryCounts,
        }

        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileBody),
        }).catch(e => console.warn('Profile save failed (non-critical):', e))
      } else {
        // Non-fatal: DB might not be configured in dev — still show confirmation
        console.warn('Trip save failed, proceeding to confirmation')
      }

      setCurrentScreen('confirmation')
    } catch (err) {
      console.error('Order save failed:', err)
      // Still proceed to confirmation — saving is best-effort
      setCurrentScreen('confirmation')
    } finally {
      setSavingOrder(false)
    }
  }

  function getSeason(dateStr: string | null | undefined): string {
    if (!dateStr) return 'Unknown'
    const month = new Date(dateStr).getMonth() + 1
    if (month >= 3 && month <= 5) return 'Spring'
    if (month >= 6 && month <= 8) return 'Summer'
    if (month >= 9 && month <= 11) return 'Fall'
    return 'Winter'
  }

  function handleRestart() {
    setCurrentScreen('landing')
    setTripData(null)
    setPackingItems([])
    setUserId(null)
    setTripId(null)
    setSelectedBag('')
    setServiceTier('explorer')
    setError(null)
  }

  return (
    <>
      {/* Global error banner */}
      {error && currentScreen === 'upload' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: '#E53E3E', color: '#fff', padding: '12px 24px',
          fontSize: 13, fontWeight: 600, textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>Dismiss</button>
        </div>
      )}

      {currentScreen === 'landing' && (
        <Landing onStart={handleStart} />
      )}

      {currentScreen === 'upload' && (
        <BoardingPassUpload
          onSubmit={handleBoardingPassSubmit}
          onBack={() => setCurrentScreen('landing')}
        />
      )}

      {currentScreen === 'loading' && (
        <TripSetupLoading onBack={() => setCurrentScreen('upload')} />
      )}

      {currentScreen === 'packing' && (
        <PackingList
          tripData={tripData}
          initialItems={packingItems}
          onNext={handlePackingListNext}
          onBack={() => setCurrentScreen('upload')}
        />
      )}

      {currentScreen === 'bags' && (
        <BagSelector
          tripData={tripData}
          itemCount={packingItems.length}
          onNext={handleBagSelectorNext}
          onBack={() => setCurrentScreen('packing')}
          loading={savingOrder}
        />
      )}

      {currentScreen === 'confirmation' && (
        <Confirmation
          tripData={tripData}
          selectedBag={selectedBag}
          serviceTier={serviceTier}
          tripId={tripId}
          onRestart={handleRestart}
        />
      )}
    </>
  )
}
