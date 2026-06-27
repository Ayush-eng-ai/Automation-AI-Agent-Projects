import { useState } from "react"
import "./App.css"
import { useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts"
import "./App.css"

const API_BASE_URL = "https://ai-recruiter-backend-7vet.onrender.com"

function App() {
  const [jobDescription, setJobDescription] = useState("")
  const [topN, setTopN] = useState(5)

  const [datasetFile, setDatasetFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)

  const [results, setResults] = useState(null)
  const [resumeResult, setResumeResult] = useState(null)
  const [interviewQuestions, setInterviewQuestions] = useState({})

  const [datasetLoading, setDatasetLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)

  const candidates = results?.candidates || []

  const selectedCandidate =
  candidates.find(
    (candidate) => String(candidate.candidate_id) === String(selectedCandidateId)
  ) || candidates[0]

const scoreChartData = selectedCandidate
  ? [
      {
        name: "Dynamic Score",
        value: Number(selectedCandidate.dynamic_score || 0),
      },
      {
        name: "Confidence",
        value: Number(selectedCandidate.explainability?.confidence || 0),
      },
    ]
  : []

const skillChartData = selectedCandidate
  ? [
      {
        name: "Matched Skills",
        value: selectedCandidate.jd_skill_matches?.length || 0,
      },
      {
        name: "Strengths",
        value: selectedCandidate.hiring_recommendation?.strengths?.length || 0,
      },
      {
        name: "Risks",
        value: selectedCandidate.hiring_recommendation?.risks?.length || 0,
      },
    ]
  : []

  const [selectedCandidateId, setSelectedCandidateId] = useState("")

  const averageScore =
    candidates.length > 0
      ? (
          candidates.reduce(
            (sum, candidate) => sum + Number(candidate.dynamic_score || 0),
            0
          ) / candidates.length
        ).toFixed(2)
      : 0

  const strongConfidenceCount = candidates.filter(
    (candidate) => candidate.explainability?.confidence >= 80
  ).length

  const rankUploadedDataset = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a Job Description")
      return
    }

    if (!datasetFile) {
      alert("Please upload candidate dataset")
      return
    }

    try {
      setDatasetLoading(true)
      setResults(null)

      const formData = new FormData()
      formData.append("job_description", jobDescription)
      formData.append("top_n", String(topN))
      formData.append("file", datasetFile)

      const response = await fetch(`${API_BASE_URL}/api/rank/uploaded-dataset`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Dataset ranking failed")
        return
      }

    

      setResults(data)
    } catch (error) {
      console.error("Dataset Ranking Error:", error)
      alert("Backend server running hai ya nahi check karo.")
    } finally {
      setDatasetLoading(false)
    }
  }
  setSelectedCandidateId(data.candidates?.[0]?.candidate_id || "")

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a Job Description")
      return
    }

    if (!resumeFile) {
      alert("Please upload a resume")
      return
    }

    try {
      setResumeLoading(true)

      const formData = new FormData()
      formData.append("job_description", jobDescription)
      formData.append("file", resumeFile)

      const response = await fetch(`${API_BASE_URL}/api/resume/match`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Resume analysis failed")
        return
      }

      setResumeResult(data)
    } catch (error) {
      console.error("Resume Match Error:", error)
      alert("Backend server running hai ya nahi check karo.")
    } finally {
      setResumeLoading(false)
    }
  }

  const generateInterviewQuestions = async (candidate) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/interview/questions?title=${encodeURIComponent(
          candidate.title || ""
        )}`
      )

      const data = await response.json()

      setInterviewQuestions((previous) => ({
        ...previous,
        [candidate.candidate_id]: data.questions || [],
      }))
    } catch (error) {
      console.error("Interview Question Error:", error)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>AI Recruiter Agent</h1>
        <p>Bulk Candidate Ranking + Individual Resume Match Platform</p>
      </div>

      <div className="card">
        <h2>1. Job Description</h2>
        <p>Paste the hiring requirement.</p>

        <textarea
          rows="8"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
        />

        <label>Top Candidates Required</label>
        <input
          type="number"
          min="1"
          value={topN}
          onChange={(event) => setTopN(Number(event.target.value))}
        />
      </div>

      <div className="card">
        <h2>2. Bulk Candidate Dataset Ranking</h2>
        <p>Upload CSV, JSON, or JSONL candidate dataset.</p>

        <input
          type="file"
          accept=".csv,.json,.jsonl"
          onChange={(event) => setDatasetFile(event.target.files?.[0] || null)}
        />

        {datasetFile && <p>Selected Dataset: {datasetFile.name}</p>}

        <button onClick={rankUploadedDataset} disabled={datasetLoading}>
          {datasetLoading ? "Ranking Dataset..." : "Rank Uploaded Dataset"}
        </button>
      </div>

      <div className="card">
        <h2>3. Individual Resume Match</h2>
        <p>This is independent from ranked candidate results.</p>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
        />

        {resumeFile && <p>Selected Resume: {resumeFile.name}</p>}

        <button onClick={analyzeResume} disabled={resumeLoading}>
          {resumeLoading ? "Analyzing Resume..." : "Analyze Resume Match"}
        </button>

        {resumeResult?.result && (
          <div className="candidate-card">
            <h3>Resume Match Result</h3>

            <p className="score">
              <strong>Match Score:</strong> {resumeResult.result.match_score}%
            </p>

            <p>
              <strong>Recommendation:</strong>{" "}
              {resumeResult.result.recommendation}
            </p>

            <p>
              <strong>Matched Skills:</strong>{" "}
              {(resumeResult.result.matched_skills || []).join(", ")}
            </p>

            <p>
              <strong>Missing Skills:</strong>{" "}
              {(resumeResult.result.missing_skills || []).join(", ")}
            </p>

            {resumeResult.result.why_score_low && (
              <>
                <h4>Why Score Is Low</h4>
                <ul>
                  {resumeResult.result.why_score_low.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {resumeResult.result.improvement_suggestions && (
              <>
                <h4>How To Improve Resume</h4>
                <ul>
                  {resumeResult.result.improvement_suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {resumeResult.result.project_suggestions && (
              <>
                <h4>Recommended Projects</h4>
                <ul>
                  {resumeResult.result.project_suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {results && (
        <div className="card results">
          <h2>4. Ranked Candidate Results</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>{results.top_n || topN}</h3>
              <p>Candidates Returned</p>
            </div>

            <div className="stat-card">
              <h3>{results.total_records || 0}</h3>
              <p>Total Records Processed</p>
            </div>

            <div className="stat-card">
              <h3>{candidates[0]?.dynamic_score || 0}</h3>
              <p>Top Score</p>
            </div>

            <div className="stat-card">
              <h3>{averageScore}</h3>
              <p>Average Score</p>
            </div>

            <div className="stat-card">
              <h3>{strongConfidenceCount}</h3>
              <p>Strong Confidence</p>
            </div>
          </div>

          {candidates.length === 0 && <p>No candidates found.</p>}

          {candidates.map((candidate, index) => (
           <div className="dashboard-layout">
              <div className="candidate-list-panel">
                <h3>Top Candidates</h3>

                {candidates.map((candidate, index) => (
                  <button
                    key={candidate.candidate_id || index}
                    className={
                      String(selectedCandidate?.candidate_id) ===
                      String(candidate.candidate_id)
                        ? "candidate-slicer active"
                        : "candidate-slicer"
                    }
                    onClick={() => setSelectedCandidateId(candidate.candidate_id)}
                  >
                    <span>#{index + 1}</span>
                    <strong>{candidate.title || "Unknown Title"}</strong>
                    <small>Score: {candidate.dynamic_score || 0}</small>
                  </button>
                ))}
              </div>

              {selectedCandidate && (
                <div className="candidate-detail-panel">
                  <div className="candidate-profile-header">
                    <div>
                      <p className="rank-badge">Selected Candidate</p>
                      <h2>{selectedCandidate.title || "Unknown Title"}</h2>
                      <p>{selectedCandidate.company || "N/A"} • {selectedCandidate.location || "N/A"}</p>
                    </div>

                    <div className="big-score">
                      {selectedCandidate.dynamic_score || 0}
                      <span>Score</span>
                    </div>
                  </div>

                  <div className="mini-info-grid">
                    <div>
                      <strong>ID</strong>
                      <span>{selectedCandidate.candidate_id || "N/A"}</span>
                    </div>

                    <div>
                      <strong>Experience</strong>
                      <span>{selectedCandidate.experience || 0} years</span>
                    </div>

                    <div>
                      <strong>Confidence</strong>
                      <span>{selectedCandidate.explainability?.confidence || 0}%</span>
                    </div>
                  </div>

                  <div className="dashboard-charts">
                    <div className="chart-card">
                      <h3>Score Breakdown</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={scoreChartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                      <h3>Candidate Signals</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={skillChartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="explain-box">
                    <h4>Why Selected</h4>
                    <p>{selectedCandidate.reason || "No reason available"}</p>

                    <ul>
                      {(selectedCandidate.explainability?.why_selected || []).map(
                        (item, idx) => (
                          <li key={idx}>{item}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="explain-box">
                    <h4>Matched JD Skills</h4>

                    <div className="skill-pills">
                      {(selectedCandidate.jd_skill_matches || []).length > 0 ? (
                        selectedCandidate.jd_skill_matches.map((skill, idx) => (
                          <span key={idx}>{skill}</span>
                        ))
                      ) : (
                        <p>No matched skills found.</p>
                      )}
                    </div>
                  </div>

                  {selectedCandidate.hiring_recommendation && (
                    <div className="explain-box">
                      <h4>AI Hiring Recommendation</h4>

                      <p>
                        <strong>Status:</strong>{" "}
                        {selectedCandidate.hiring_recommendation.recommendation}
                      </p>

                      <p>
                        <strong>Confidence:</strong>{" "}
                        {selectedCandidate.hiring_recommendation.confidence}%
                      </p>

                      <p>
                        <strong>Decision:</strong>{" "}
                        {selectedCandidate.hiring_recommendation.decision}
                      </p>

                      <h5>Strengths</h5>
                      <ul>
                        {(selectedCandidate.hiring_recommendation.strengths || []).map(
                          (item, idx) => (
                            <li key={idx}>{item}</li>
                          )
                        )}
                      </ul>

                      <h5>Risks</h5>
                      <ul>
                        {(selectedCandidate.hiring_recommendation.risks || []).map(
                          (item, idx) => (
                            <li key={idx}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <button onClick={() => generateInterviewQuestions(selectedCandidate)}>
                    Generate Interview Questions
                  </button>

                  {interviewQuestions[selectedCandidate.candidate_id] && (
                    <div className="explain-box">
                      <h4>Interview Questions</h4>

                      <ul>
                        {interviewQuestions[selectedCandidate.candidate_id].map(
                          (question, idx) => (
                            <li key={idx}>{question}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div> 
  )
}

export default App

