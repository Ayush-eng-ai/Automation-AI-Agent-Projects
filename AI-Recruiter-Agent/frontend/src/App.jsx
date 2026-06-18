import { useState } from "react"
import "./App.css"

const API_BASE_URL = "http://127.0.0.1:8000"

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
            <div className="candidate-card" key={candidate.candidate_id || index}>
              <div className="rank-badge">Rank #{index + 1}</div>

              <h3>
                #{index + 1} - {candidate.title || "Unknown Title"}
              </h3>

              <p>
                <strong>ID:</strong> {candidate.candidate_id || "N/A"}
              </p>

              <p>
                <strong>Company:</strong> {candidate.company || "N/A"}
              </p>

              <p>
                <strong>Location:</strong> {candidate.location || "N/A"}
              </p>

              <p>
                <strong>Experience:</strong> {candidate.experience || 0} years
              </p>

              <p className="score">
                <strong>Dynamic Score:</strong> {candidate.dynamic_score || 0}
              </p>

              <p className="reason">
                <strong>Reason:</strong> {candidate.reason || "No reason available"}
              </p>

              {candidate.explainability && (
                <div className="explain-box">
                  <h4>Why Selected</h4>

                  <p>
                    <strong>Confidence:</strong>{" "}
                    {candidate.explainability?.confidence || 0}%
                  </p>

                  <ul>
                    {(candidate.explainability?.why_selected || []).map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <button onClick={() => generateInterviewQuestions(candidate)}>
                Generate Interview Questions
              </button>

              {interviewQuestions[candidate.candidate_id] && (
                <div className="explain-box">
                  <h4>Interview Questions</h4>

                  <ul>
                    {interviewQuestions[candidate.candidate_id].map(
                      (question, idx) => (
                        <li key={idx}>{question}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App

