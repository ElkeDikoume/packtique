'use client'

import { useRef, useState } from 'react'
import Nav from '@/components/Nav'
import StepBar from '@/components/StepBar'

interface BoardingPassUploadProps {
  onSubmit: (file: File | null, text: string | null) => void
  onBack: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1.5px solid #E2EAF4', borderRadius: 8,
  padding: '11px 14px', fontSize: 14, color: '#1B2D4F',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
}

export default function BoardingPassUpload({ onSubmit, onBack }: BoardingPassUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [manualText, setManualText] = useState('')
  const [from, setFrom] = useState('New York (JFK)')
  const [to, setTo] = useState('Paris (CDG)')
  const [departs, setDeparts] = useState('2026-09-15')
  const [returns, setReturns] = useState('2026-09-22')
  const [airline, setAirline] = useState('Air France')
  const [fareClass, setFareClass] = useState('Economy')
  const [tripPurpose, setTripPurpose] = useState('Leisure')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setSelectedFile(f)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setSelectedFile(f)
  }

  function handleSubmitFile() {
    if (selectedFile) {
      onSubmit(selectedFile, null)
    }
  }

  function handleSubmitManual() {
    // Build a text description from the manual form
    const text = `Flight: ${airline} from ${from} to ${to}. Departs: ${departs}. Returns: ${returns}. Fare class: ${fareClass}. Trip purpose: ${tripPurpose}.`
    onSubmit(null, text)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      <Nav light onLogoClick={onBack} />

      <div style={{ paddingTop: 84, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <StepBar current={0} />
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1B2D4F', letterSpacing: '-0.8px', marginBottom: 6 }}>
          Start with your trip.
        </h1>
        <p style={{ fontSize: 15, color: '#64748B', marginBottom: 32, lineHeight: 1.6 }}>
          Drop your boarding pass and we&apos;ll extract everything — airline, route, fare class, baggage rules — automatically.
        </p>

        {/* Upload drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#C9A84C' : selectedFile ? '#0D7A70' : '#D1DCE8'}`,
            borderRadius: 16, padding: '48px 24px', textAlign: 'center',
            cursor: 'pointer', background: dragging ? 'rgba(201,168,76,0.04)' : selectedFile ? 'rgba(13,122,112,0.03)' : '#fff',
            transition: 'all 0.2s', marginBottom: 16,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div style={{
            width: 52, height: 52, background: selectedFile ? 'rgba(13,122,112,0.1)' : '#F0F4FA', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 22
          }}>{selectedFile ? '✅' : '🎫'}</div>
          {selectedFile ? (
            <>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0D7A70', marginBottom: 4 }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                Click to change · or drag a different file
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1B2D4F', marginBottom: 4 }}>
                Drop your boarding pass
              </p>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                PDF, image, or text file · or click to browse
              </p>
            </>
          )}
        </div>

        {selectedFile && (
          <button onClick={handleSubmitFile} style={{
            width: '100%', background: '#1B2D4F', color: '#fff',
            fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 10,
            border: 'none', cursor: 'pointer', letterSpacing: '0.2px', marginBottom: 24,
          }}>
            Extract from boarding pass →
          </button>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: '#E8EDF4' }} />
          <span style={{ fontSize: 11, color: '#B0BAC8', fontWeight: 600, letterSpacing: '1px' }}>OR ENTER MANUALLY</span>
          <div style={{ flex: 1, height: 1, background: '#E8EDF4' }} />
        </div>

        {/* Manual form */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(27,45,79,0.08)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', marginBottom: 7, textTransform: 'uppercase' }}>From</label>
              <input style={inputStyle} value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', marginBottom: 7, textTransform: 'uppercase' }}>To</label>
              <input style={inputStyle} value={to} onChange={e => setTo(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', marginBottom: 7, textTransform: 'uppercase' }}>Departs</label>
              <input type="date" style={inputStyle} value={departs} onChange={e => setDeparts(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', marginBottom: 7, textTransform: 'uppercase' }}>Returns</label>
              <input type="date" style={inputStyle} value={returns} onChange={e => setReturns(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', marginBottom: 7, textTransform: 'uppercase' }}>Airline</label>
              <select style={inputStyle} value={airline} onChange={e => setAirline(e.target.value)}>
                <option>Air France</option>
                <option>Delta</option>
                <option>United</option>
                <option>American</option>
                <option>British Airways</option>
                <option>Lufthansa</option>
                <option>Emirates</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', marginBottom: 7, textTransform: 'uppercase' }}>Fare Class</label>
              <select style={inputStyle} value={fareClass} onChange={e => setFareClass(e.target.value)}>
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase' }}>Trip Purpose</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Leisure', 'Business', 'Honeymoon', 'Family', 'Adventure'].map(t => (
                <button key={t} onClick={() => setTripPurpose(t)} style={{
                  padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: tripPurpose === t ? 'none' : '1.5px solid #E2EAF4',
                  background: tripPurpose === t ? '#1B2D4F' : 'transparent',
                  color: tripPurpose === t ? '#fff' : '#64748B',
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSubmitManual} style={{
          marginTop: 20, width: '100%', background: '#C9A84C', color: '#1B2D4F',
          fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 10,
          border: 'none', cursor: 'pointer', letterSpacing: '0.2px',
        }}>
          Build my packing list →
        </button>
      </div>
    </div>
  )
}
