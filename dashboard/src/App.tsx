import { useMemo, useState } from 'react'
import './App.css'

type Visit = {
  id: string
  date: string
  facility: string
  department: string
  reason: string
  diagnosis: string
  interventions: string[]
  medications: string[]
  notes: string
}

type Patient = {
  id: string
  alias: string
  demographics: {
    age: number
    gender: 'Female' | 'Male' | 'Non-binary'
  }
  primaryCondition: string
  riskScore: 'Low' | 'Moderate' | 'High'
  lastUpdated: string
  journey: Visit[]
}

const patients: Patient[] = [
  {
    id: 'A-102938',
    alias: 'Patient Aurora',
    demographics: { age: 54, gender: 'Female' },
    primaryCondition: 'Type 2 Diabetes with Hypertension',
    riskScore: 'High',
    lastUpdated: 'Nov 06, 2025 14:15',
    journey: [
      {
        id: 'v-1',
        date: 'Jan 18, 2025',
        facility: 'St. Anne Medical Center',
        department: 'Emergency',
        reason: 'Acute dizziness and blurred vision',
        diagnosis: 'Hypertensive crisis',
        interventions: ['IV antihypertensive therapy', 'Continuous cardiac monitoring'],
        medications: ['Lisinopril 20mg', 'Metformin 1000mg'],
        notes: 'Stabilised in ED, transferred to cardiometabolic ward for 48h observation.'
      },
      {
        id: 'v-2',
        date: 'Mar 03, 2025',
        facility: 'St. Anne Endocrinology Unit',
        department: 'Endocrinology',
        reason: 'Quarterly metabolic management',
        diagnosis: 'Type 2 Diabetes (HbA1c 8.1)',
        interventions: ['Medication titration', 'Dietary coaching'],
        medications: ['Semaglutide 0.5mg weekly', 'Lisinopril 20mg'],
        notes: 'Introduced GLP-1 therapy, arranged telehealth follow-up in 4 weeks.'
      },
      {
        id: 'v-3',
        date: 'Aug 22, 2025',
        facility: 'City Heart Institute',
        department: 'Cardiology',
        reason: 'Routine cardiovascular imaging',
        diagnosis: 'Left ventricular hypertrophy (stable)',
        interventions: ['Echocardiogram', 'Medication adherence review'],
        medications: ['Lisinopril 20mg', 'Semaglutide 1mg weekly'],
        notes: 'Noted borderline renal function, recommend nephrology consult next visit.'
      }
    ]
  },
  {
    id: 'B-776541',
    alias: 'Patient Beacon',
    demographics: { age: 38, gender: 'Male' },
    primaryCondition: 'Post-operative Oncology Surveillance',
    riskScore: 'Moderate',
    lastUpdated: 'Nov 05, 2025 09:30',
    journey: [
      {
        id: 'v-4',
        date: 'Feb 11, 2025',
        facility: 'Harborview Oncology',
        department: 'Surgical Oncology',
        reason: 'Stage II colon cancer resection',
        diagnosis: 'Colon adenocarcinoma (post-op day 3)',
        interventions: ['Laparoscopic right hemicolectomy', 'Enhanced recovery protocol'],
        medications: ['Capecitabine 1500mg BID'],
        notes: 'Discharged on day 4 with chemo plan and remote monitoring kit.'
      },
      {
        id: 'v-5',
        date: 'May 27, 2025',
        facility: 'Harborview Infusion Center',
        department: 'Medical Oncology',
        reason: 'Cycle 3 adjuvant chemotherapy',
        diagnosis: 'Chemo-induced neuropathy (grade 1)',
        interventions: ['Dose adjustment', 'Neuropathy symptom management'],
        medications: ['Capecitabine 1300mg BID', 'Gabapentin 100mg nightly'],
        notes: 'Encouraged hydration, scheduled toxicity check-in in 10 days.'
      },
      {
        id: 'v-6',
        date: 'Sep 09, 2025',
        facility: 'Harborview Imaging Center',
        department: 'Radiology',
        reason: 'Surveillance CT abdomen and pelvis',
        diagnosis: 'No evidence of recurrence',
        interventions: ['Contrast CT scan', 'Multidisciplinary review'],
        medications: ['Vitamin D supplement', 'Gabapentin 100mg nightly'],
        notes: 'Referred to survivorship program, next scan planned in 6 months.'
      }
    ]
  },
  {
    id: 'C-442210',
    alias: 'Patient Cascade',
    demographics: { age: 67, gender: 'Female' },
    primaryCondition: 'Chronic Heart Failure (NYHA II)',
    riskScore: 'Moderate',
    lastUpdated: 'Oct 28, 2025 17:45',
    journey: [
      {
        id: 'v-7',
        date: 'Jan 04, 2025',
        facility: 'Riverside Hospital',
        department: 'Cardiology',
        reason: 'Annual heart failure review',
        diagnosis: 'HFpEF stable status',
        interventions: ['Medication reconciliation', 'Fluid restriction coaching'],
        medications: ['Sacubitril/Valsartan 49/51mg BID', 'Dapagliflozin 10mg daily'],
        notes: 'Weight down 1.8kg, BNP trending downwards.'
      },
      {
        id: 'v-8',
        date: 'Jun 14, 2025',
        facility: 'Riverside Telehealth',
        department: 'Virtual Care',
        reason: 'Remote fluid status alert',
        diagnosis: 'Mild fluid retention',
        interventions: ['Diuretic up-titration', 'Remote monitoring education'],
        medications: ['Furosemide 40mg PRN', 'Sacubitril/Valsartan 49/51mg BID'],
        notes: 'Symptoms resolved within 72h; remote kit recalibrated.'
      },
      {
        id: 'v-9',
        date: 'Oct 02, 2025',
        facility: 'Riverside Rehab',
        department: 'Cardiac Rehab',
        reason: 'Reconditioning program',
        diagnosis: 'Improved functional capacity (6MWT +48m)',
        interventions: ['Supervised exercise', 'Nutrition class'],
        medications: ['Sacubitril/Valsartan 49/51mg BID', 'Dapagliflozin 10mg daily'],
        notes: 'Graduated rehab, next in-person review scheduled in 3 months.'
      }
    ]
  },
  {
    id: 'D-118900',
    alias: 'Patient Drift',
    demographics: { age: 29, gender: 'Non-binary' },
    primaryCondition: 'Autoimmune Neurology (MS RR)',
    riskScore: 'Low',
    lastUpdated: 'Oct 19, 2025 11:05',
    journey: [
      {
        id: 'v-10',
        date: 'Feb 21, 2025',
        facility: 'Northstar Neurology Clinic',
        department: 'Neurology',
        reason: 'Bi-annual MS review',
        diagnosis: 'RRMS stable, no relapse',
        interventions: ['Neuro exam', 'MRI brain with contrast'],
        medications: ['Ocrelizumab infusion'],
        notes: 'MRI shows no new lesions; infusion tolerated well.'
      },
      {
        id: 'v-11',
        date: 'Jun 30, 2025',
        facility: 'Northstar Day Hospital',
        department: 'Infusion Suite',
        reason: 'Disease-modifying therapy infusion',
        diagnosis: 'RRMS maintenance phase',
        interventions: ['Ocrelizumab 600mg IV', 'Symptom questionnaire'],
        medications: ['Ocrelizumab 600mg IV'],
        notes: 'Reported mild fatigue, provided lifestyle coaching resources.'
      },
      {
        id: 'v-12',
        date: 'Oct 07, 2025',
        facility: 'Northstar Virtual',
        department: 'Tele-neurology',
        reason: 'Digital symptom check-in',
        diagnosis: 'No acute changes',
        interventions: ['Patient-reported outcomes review', 'Sleep hygiene plan'],
        medications: ['Vitamin D 2000 IU daily'],
        notes: 'Preparing for next infusion in Dec; referral to occupational therapy placed.'
      }
    ]
  },
  {
    id: 'E-992134',
    alias: 'Patient Ember',
    demographics: { age: 46, gender: 'Female' },
    primaryCondition: 'Pulmonary Sarcoidosis Follow-up',
    riskScore: 'Moderate',
    lastUpdated: 'Oct 31, 2025 08:40',
    journey: [
      {
        id: 'v-13',
        date: 'Jan 29, 2025',
        facility: 'Summit Pulmonology',
        department: 'Pulmonology',
        reason: 'Biopsy confirmation visit',
        diagnosis: 'Pulmonary sarcoidosis stage II',
        interventions: ['Video-assisted thoracoscopic biopsy', 'Pulmonary function testing'],
        medications: ['Prednisone 20mg daily'],
        notes: 'Initiated steroid taper, planned imaging surveillance at 6 months.'
      },
      {
        id: 'v-14',
        date: 'Jun 16, 2025',
        facility: 'Summit Pulmonology',
        department: 'Pulmonology',
        reason: 'Response assessment follow-up',
        diagnosis: 'Improved nodular burden, DLCO stable',
        interventions: ['Six-minute walk test', 'Steroid taper counselling'],
        medications: ['Prednisone 10mg daily', 'Inhaled budesonide-formoterol'],
        notes: 'Introduced pulmonary rehab, next CT in 4 months.'
      },
      {
        id: 'v-15',
        date: 'Oct 11, 2025',
        facility: 'Summit Imaging Center',
        department: 'Radiology',
        reason: 'High-resolution CT chest',
        diagnosis: 'Stable reticulonodular pattern',
        interventions: ['Radiology consult', 'Virtual case conference'],
        medications: ['Prednisone 7.5mg daily', 'Inhaled budesonide-formoterol'],
        notes: 'Cleared to continue taper; consider methotrexate if relapse.'
      }
    ]
  },
  {
    id: 'F-660842',
    alias: 'Patient Fjord',
    demographics: { age: 72, gender: 'Male' },
    primaryCondition: 'Chronic Kidney Disease Stage 4',
    riskScore: 'High',
    lastUpdated: 'Nov 04, 2025 16:20',
    journey: [
      {
        id: 'v-16',
        date: 'Feb 05, 2025',
        facility: 'Evergreen Nephrology',
        department: 'Nephrology',
        reason: 'Quarterly renal monitoring',
        diagnosis: 'CKD stage 4 with metabolic acidosis',
        interventions: ['eGFR trend review', 'Dietitian consult'],
        medications: ['Sodium bicarbonate 650mg BID', 'Losartan 50mg daily'],
        notes: 'Discussed transplant evaluation, referred to education class.'
      },
      {
        id: 'v-17',
        date: 'Jul 08, 2025',
        facility: 'Evergreen Infusion Suite',
        department: 'Infusion Therapy',
        reason: 'IV iron supplementation',
        diagnosis: 'Iron deficiency anemia secondary to CKD',
        interventions: ['Ferric carboxymaltose infusion', 'Symptom management coaching'],
        medications: ['Ferric carboxymaltose 750mg', 'Sodium bicarbonate 650mg BID'],
        notes: 'No infusion reactions, scheduled anemia lab panel in 4 weeks.'
      },
      {
        id: 'v-18',
        date: 'Sep 26, 2025',
        facility: 'Evergreen Transplant Center',
        department: 'Transplant Evaluation',
        reason: 'Kidney transplant workup',
        diagnosis: 'Candidate evaluation in progress',
        interventions: ['Cardiac stress test', 'Psychosocial assessment'],
        medications: ['Sodium bicarbonate 650mg BID', 'Losartan 50mg daily'],
        notes: 'Pending panel reactive antibody results, caregiver plan documented.'
      }
    ]
  },
  {
    id: 'G-550301',
    alias: 'Patient Grove',
    demographics: { age: 61, gender: 'Female' },
    primaryCondition: 'Rheumatoid Arthritis with Biologic Therapy',
    riskScore: 'Moderate',
    lastUpdated: 'Nov 02, 2025 12:05',
    journey: [
      {
        id: 'v-19',
        date: 'Jan 12, 2025',
        facility: 'Oakview Rheumatology',
        department: 'Rheumatology',
        reason: 'Biologic infusion maintenance',
        diagnosis: 'Seropositive RA, low disease activity',
        interventions: ['DAS28 score review', 'Infusion monitoring'],
        medications: ['Infliximab 5mg/kg IV', 'Methotrexate 15mg weekly'],
        notes: 'Inflammatory markers trending down; physical therapy recommended.'
      },
      {
        id: 'v-20',
        date: 'May 01, 2025',
        facility: 'Oakview Labs',
        department: 'Laboratory Medicine',
        reason: 'Quarterly safety labs',
        diagnosis: 'Stable hematologic profile',
        interventions: ['CBC with differential', 'Liver function panel'],
        medications: ['Infliximab 5mg/kg IV', 'Methotrexate 15mg weekly', 'Folic acid 1mg daily'],
        notes: 'No dose adjustments needed, continue infusions every 8 weeks.'
      },
      {
        id: 'v-21',
        date: 'Sep 19, 2025',
        facility: 'Oakview Digital Clinic',
        department: 'Tele-rheumatology',
        reason: 'Symptom flare tele-visit',
        diagnosis: 'RA flare, mild synovitis wrists',
        interventions: ['Short steroid burst', 'Occupational therapy referral'],
        medications: ['Prednisone 10mg taper', 'Infliximab 5mg/kg IV'],
        notes: 'Scheduled in-person joint ultrasound within 2 weeks.'
      }
    ]
  },
  {
    id: 'H-773204',
    alias: 'Patient Harbor',
    demographics: { age: 34, gender: 'Male' },
    primaryCondition: 'Behavioral Health Integrated Care',
    riskScore: 'Low',
    lastUpdated: 'Nov 03, 2025 10:10',
    journey: [
      {
        id: 'v-22',
        date: 'Mar 14, 2025',
        facility: 'Lighthouse Behavioral Health',
        department: 'Psychiatry',
        reason: 'Initial psychiatric evaluation',
        diagnosis: 'Generalized anxiety disorder',
        interventions: ['Cognitive behavioral therapy enrollment', 'Medication initiation'],
        medications: ['Sertraline 50mg daily'],
        notes: 'Developed coping strategy toolkit, follow-up set in 4 weeks.'
      },
      {
        id: 'v-23',
        date: 'Jul 10, 2025',
        facility: 'Lighthouse Virtual',
        department: 'Tele-therapy',
        reason: 'Session 8 CBT series',
        diagnosis: 'Improved GAD-7 score (14 → 6)',
        interventions: ['Exposure therapy exercises', 'Mindfulness integration'],
        medications: ['Sertraline 75mg daily'],
        notes: 'Created relapse prevention plan, next review in 2 months.'
      },
      {
        id: 'v-24',
        date: 'Oct 29, 2025',
        facility: 'Lighthouse Primary Care',
        department: 'Primary Care',
        reason: 'Integrated care check-in',
        diagnosis: 'Stable mood, mild insomnia',
        interventions: ['Sleep hygiene coaching', 'Medication reconciliation'],
        medications: ['Sertraline 50mg daily', 'Melatonin 3mg nightly'],
        notes: 'Considering taper in Jan pending symptom stability.'
      }
    ]
  }
]

const fuzzyMatch = (value: string, query: string) =>
  value.toLowerCase().includes(query.toLowerCase())

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id ?? '')
  const [isSearchActive, setIsSearchActive] = useState(false)

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId),
    [selectedPatientId]
  )

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) {
      return patients.slice(0, 5)
    }

    return patients
      .filter((patient) =>
        [patient.id, patient.alias, patient.primaryCondition].some((value) =>
          fuzzyMatch(value, searchTerm)
        )
      )
      .slice(0, 6)
  }, [searchTerm])

  const handleSelect = (patientId: string) => {
    setSelectedPatientId(patientId)
    setSearchTerm('')
    setIsSearchActive(false)
  }

  return (
    <div className="dashboard-wrapper">
      <header className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Clinical Navigation</p>
          <h1>Patient Journey Explorer</h1>
          <p className="hero__subtitle">
            Search by patient identifier to surface a rich, chronological view of encounters,
            diagnoses, and interventions. Designed for fast clinical context sharing across
            multidisciplinary teams.
          </p>
          <div className="search-panel">
            <label htmlFor="patient-search" className="search-panel__label">
              Find a patient by ID or alias
            </label>
            <div className={`search-panel__input ${suggestions.length ? 'has-suggestions' : ''}`}>
              <input
                id="patient-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Try A-102938 or Patient Beacon"
                autoComplete="off"
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
              />
              <span className="search-icon" aria-hidden="true">
                🔍
              </span>
              {suggestions.length > 0 && isSearchActive && (
                <ul className="suggestions" role="listbox">
                  {suggestions.map((patient) => {
                    const isActive = patient.id === selectedPatientId
                    return (
                      <li
                        key={patient.id}
                        className={isActive ? 'suggestion is-active' : 'suggestion'}
                        onClick={() => handleSelect(patient.id)}
                        onMouseDown={(event) => event.preventDefault()}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            handleSelect(patient.id)
                          }
                        }}
                        role="option"
                        aria-selected={isActive}
                        tabIndex={0}
                      >
                        <div className="suggestion__primary">
                          <span className="suggestion__id">{patient.id}</span>
                          <span className="suggestion__alias">{patient.alias}</span>
                        </div>
                        <div className="suggestion__secondary">
                          <span>{patient.primaryCondition}</span>
                          <span className={`risk-tag risk-${patient.riskScore.toLowerCase()}`}>
                            {patient.riskScore}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="hero__glow" aria-hidden="true" />
      </header>

      {selectedPatient ? (
        <main className="content">
          <section className="patient-summary">
            <div className="summary-header">
              <div>
                <p className="summary-eyebrow">Selected patient</p>
                <h2>
                  {selectedPatient.alias}
                  <span className="summary-id">{selectedPatient.id}</span>
                </h2>
              </div>
              <div className="summary-meta">
                <div>
                  <span className="meta-label">Primary focus</span>
                  <span className="meta-value">{selectedPatient.primaryCondition}</span>
                </div>
                <div>
                  <span className="meta-label">Risk</span>
                  <span
                    className={`meta-badge risk-${selectedPatient.riskScore.toLowerCase()}`}
                  >
                    {selectedPatient.riskScore}
                  </span>
                </div>
                <div>
                  <span className="meta-label">Profile</span>
                  <span className="meta-value">
                    {selectedPatient.demographics.age} · {selectedPatient.demographics.gender}
                  </span>
                </div>
                <div>
                  <span className="meta-label">Last synced</span>
                  <span className="meta-value">{selectedPatient.lastUpdated}</span>
                </div>
              </div>
            </div>
            <p className="summary-description">
              The journey view below captures every encounter, major diagnostic moment, and
              therapeutic action across systems. Hover over any milestone to reveal clinical
              context, or jump to the action center to orchestrate the next intervention.
            </p>
          </section>

          <section className="journey">
            <div className="journey__header">
              <h3>Patient journey</h3>
              <p>Reverse chronological overview of documented encounters across care teams.</p>
            </div>
            <ol className="timeline" role="list">
              {selectedPatient.journey.map((visit, index) => (
                <li key={visit.id} className="timeline__item">
                  <div className="timeline__marker" aria-hidden="true">
                    <span>{selectedPatient.journey.length - index}</span>
                  </div>
                  <div className="timeline__content">
                    <div className="timeline__header">
                      <div>
                        <p className="timeline__date">{visit.date}</p>
                        <h4>{visit.facility}</h4>
                      </div>
                      <span className="timeline__badge">{visit.department}</span>
                    </div>
                    <div className="timeline__details">
                      <div className="detail-row">
                        <span className="detail-label">Reason</span>
                        <span className="detail-value">{visit.reason}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Diagnosis</span>
                        <span className="detail-value">{visit.diagnosis}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Interventions</span>
                        <span className="detail-value">
                          {visit.interventions.join(' · ')}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Medications</span>
                        <span className="detail-value">{visit.medications.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Notes</span>
                        <span className="detail-value">{visit.notes}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="actions">
            <h3>Action center</h3>
            <div className="actions__grid">
              <article className="action-card">
                <div>
                  <h4>Launch new treatment plan</h4>
                  <p>
                    Trigger collaborative protocol design, pre-populate order sets, and
                    notify the care team within seconds.
                  </p>
                </div>
                <button type="button">Start treatment</button>
              </article>
              <article className="action-card">
                <div>
                  <h4>Schedule multidisciplinary review</h4>
                  <p>
                    Coordinate cardiology, pharmacy, and nursing input with a shared agenda
                    and structured wrap-up notes.
                  </p>
                </div>
                <button type="button" className="secondary">Request review</button>
              </article>
            </div>
          </section>
        </main>
      ) : (
        <main className="content empty-state">
          <p>Select a patient to unlock their journey overview.</p>
        </main>
      )}
    </div>
  )
}

export default App
