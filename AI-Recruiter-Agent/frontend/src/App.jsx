import { useMemo, useState } from "react"
import "./App.css"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"

const API_BASE_URL = "https://ai-recruiter-backend-7vet.onrender.com"

const REDROB_JD = `Senior AI Engineer — Founding Team

Company: Redrob AI
Location: Pune/Noida, India
Employment Type: Full-time
Experience Required: 5–9 years

We need someone with deep technical depth in modern ML systems — embeddings, retrieval, ranking, LLMs, fine-tuning — and a scrappy product-engineering attitude.

The role owns the intelligence layer of the product: ranking, retrieval, matching systems, candidate-JD matching, recruiter search quality, evaluation infrastructure, offline benchmarks, online A/B testing, recruiter feedback loops, and production AI systems.

Required:
- Production experience with embeddings-based retrieval systems
- Vector databases or hybrid search infrastructure such as FAISS, Pinecone, Qdrant, Milvus, OpenSearch, Elasticsearch
- Strong Python
- Evaluation frameworks for ranking systems such as NDCG, MRR, MAP, A/B testing
- Search, recommendation, ranking, retrieval, production ML, and product engineering experience
- Preference for candidates around 5–9 years with product-company AI/ML experience
- Strong behavioral signals such as recruiter response rate, open-to-work status, recent activity, and short notice period`

function App() {
  const [jobDescription, setJobDescription] = useState("")
  const [topN, setTopN] = useState(50)
  const [datasetFile, setDatasetFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [results, setResults] = useState(null)
  const [resumeResult, setResumeResult] = useState(null)
  const [interviewQuestions, setInterviewQuestions] = useState({})
  const [datasetLoading, setDatasetLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [recommendationFilter, setRecommendationFilter] = useState("all")
  const [minScore, setMinScore] = useState(50);

  const candidates = results?.candidates || []

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchText = [
        candidate.candidate_id,
        candidate.title,
        candidate.company,
        candidate.location,
        ...(candidate.jd_skill_matches || []),
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch = searchText.includes(searchTerm.toLowerCase())
      const recommendation =
        candidate.hiring_recommendation?.recommendation || "Unknown"
      const matchesRecommendation =
        recommendationFilter === "all" || recommendation === recommendationFilter
      const matchesScore =
        minScore === "" || Number(candidate.dynamic_score || 0) >= Number(minScore)

      return matchesSearch && matchesRecommendation && matchesScore
    })
  }, [candidates, searchTerm, recommendationFilter, minScore])

  const selectedCandidate =
    filteredCandidates.find(
      (candidate) => String(candidate.candidate_id) === String(selectedCandidateId)
    ) ||
    candidates.find(
      (candidate) => String(candidate.candidate_id) === String(selectedCandidateId)
    ) ||
    filteredCandidates[0] ||
    candidates[0]

  const averageScore = useMemo(() => {
    if (candidates.length === 0) return 0
    const totalScore = candidates.reduce(
      (sum, candidate) => sum + Number(candidate.dynamic_score || 0),
      0
    )
    return (totalScore / candidates.length).toFixed(2)
  }, [candidates])

  const recommendedCount = useMemo(
    () =>
      candidates.filter((candidate) =>
        ["Strongly Recommended", "Recommended"].includes(
          candidate.hiring_recommendation?.recommendation
        )
      ).length,
    [candidates]
  )

  const averageConfidence = useMemo(() => {
    if (candidates.length === 0) return 0
    const totalConfidence = candidates.reduce(
      (sum, candidate) =>
        sum +
        Number(
          candidate.hiring_recommendation?.confidence ||
            candidate.explainability?.confidence ||
            0
        ),
      0
    )
    return (totalConfidence / candidates.length).toFixed(1)
  }, [candidates])

  const strongConfidenceCount = useMemo(
    () =>
      candidates.filter(
        (candidate) =>
          Number(
            candidate.hiring_recommendation?.confidence ||
              candidate.explainability?.confidence ||
              0
          ) >= 75
      ).length,
    [candidates]
  )

  const recommendationOptions = useMemo(() => {
    const unique = new Set(
      candidates.map(
        (candidate) =>
          candidate.hiring_recommendation?.recommendation || "Unknown"
      )
    )
    return Array.from(unique)
  }, [candidates])

  const scoreChartData = selectedCandidate
    ? [
        {
          name: "Dynamic Score",
          value: Number(selectedCandidate.dynamic_score || 0),
        },
        {
          name: "Confidence",
          value: Number(
            selectedCandidate.hiring_recommendation?.confidence ||
              selectedCandidate.explainability?.confidence ||
              0
          ),
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

  const rankTrendData = filteredCandidates.slice(0, 10).map((candidate, index) => ({
    rank: `#${index + 1}`,
    score: Number(candidate.dynamic_score || 0),
  }))

  const readApiResponse = async (response) => {
    const contentType = response.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      return response.json()
    }
    return {
      detail: await response.text(),
    }
  }

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
      setSelectedCandidateId("")

      const formData = new FormData()
      formData.append("job_description", jobDescription)
      formData.append("top_n", String(topN))
      formData.append("file", datasetFile)

      const response = await fetch(`${API_BASE_URL}/api/rank/uploaded-dataset`, {
        method: "POST",
        body: formData,
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        alert(data.detail || "Dataset ranking failed")
        return
      }

      setResults(data)
      setSelectedCandidateId(
        data.candidates?.[0]?.candidate_id ? String(data.candidates[0].candidate_id) : ""
      )
    } catch (error) {
      console.error("Dataset Ranking Error:", error)
      alert("Backend server running hai ya nahi check karo.")
    } finally {
      setDatasetLoading(false)
    }
  }

  const downloadSubmissionCsv = async () => {
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

    const formData = new FormData()
    formData.append("job_description", jobDescription)
    formData.append("file", datasetFile)

    const response = await fetch(`${API_BASE_URL}/api/submission/upload-and-download`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      alert(errorText || "CSV generation failed")
      return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Alpha_Decoders.csv"
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("CSV Download Error:", error)
    alert("CSV generate nahi ho paayi. Backend check karo.")
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

      const data = await readApiResponse(response)

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
    if (!candidate) return

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/interview/questions?title=${encodeURIComponent(
          candidate.title || ""
        )}`
      )

      const data = await readApiResponse(response)

      if (!response.ok) {
        alert(data.detail || "Interview question generation failed")
        return
      }

      setInterviewQuestions((previous) => ({
        ...previous,
        [candidate.candidate_id]: data.questions || [],
      }))
    } catch (error) {
      console.error("Interview Question Error:", error)
      alert("Interview questions generate nahi ho paaye.")
    }
  }

  const downloadDashboardCsv = () => {
    if (candidates.length === 0) {
      alert("No candidates available to export.")
      return
    }

    const header = ["candidate_id", "rank", "score", "reasoning"]

    const rows = candidates.map((candidate, index) => {
      const reasoning =
        candidate.reason ||
        candidate.explainability?.why_selected?.join(" | ") ||
        "Candidate ranked by AI Recruiter Agent."

      return [
        candidate.candidate_id || "",
        index + 1,
        Number(candidate.dynamic_score || 0),
        `"${String(reasoning).replaceAll('"', '""')}"`,
      ].join(",")
    })

    const csv = [header.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "ai_recruiter_ranked_candidates.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadRedrobJd = () => {
    setJobDescription(REDROB_JD)
    setTopN(100)
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="brand-row">
          <img
            src="/brand/navbar-logo.png"
            alt="AI Recruiter Agent Logo"
            className="navbar-logo"
          />
          <div>
            <span className="eyebrow">Redrob Hackathon • AI Recruitment Platform</span>
            <h1>AI Recruiter Agent</h1>
            <p>
              Premium recruiter dashboard for JD parsing, resume intelligence,
              candidate ranking, explainable AI recommendations, and interview
              question generation.
            </p>
          </div>
        </div>

        <div className="hero-actions">
          <button type="button" onClick={loadRedrobJd}>
            Load Redrob JD
          </button>
          <a href={API_BASE_URL + "/docs"} target="_blank" rel="noreferrer">
            Backend API Docs
          </a>
        </div>
      </section>

      <section className="workflow-grid">
        <div className="glass-card input-card">
          <div className="section-title">
            <span>01</span>
            <div>
              <h2>Job Description</h2>
              <p>Paste hiring requirements or load the Redrob AI Engineer JD.</p>
            </div>
          </div>

          <textarea
            rows="9"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />

          <div className="form-grid">
            <div>
              <label htmlFor="top-n">Top Candidates Required</label>
              <input
                id="top-n"
                type="number"
                min="1"
                max="100"
                value={topN}
                onChange={(event) => setTopN(Number(event.target.value))}
              />
            </div>

            <div className="hint-box">
              For official hackathon output, use <strong>100</strong> candidates.
            </div>
          </div>
        </div>

        <div className="glass-card input-card">
          <div className="section-title">
            <span>02</span>
            <div>
              <h2>Bulk Candidate Ranking</h2>
              <p>Upload CSV, JSON, or JSONL candidate dataset.</p>
            </div>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept=".csv,.json,.jsonl"
              onChange={(event) => setDatasetFile(event.target.files?.[0] || null)}
            />
            <strong>{datasetFile ? datasetFile.name : "Choose candidate dataset"}</strong>
            <small>Supported: CSV, JSON, JSONL</small>
          </label>

          <button onClick={rankUploadedDataset} disabled={datasetLoading}>
            {datasetLoading ? "Ranking Dataset..." : "Rank Uploaded Dataset"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={downloadSubmissionCsv}
            disabled={datasetLoading}
          >
            {datasetLoading ? "Generating CSV..." : "Generate Submission CSV"}
          </button>

          {datasetLoading && (
            <div className="loading-card">
              <img
                src="/brand/loading-logo.png"
                alt="Loading AI Recruiter Agent"
                className="loading-logo"
              />
              <p>AI is ranking candidates...</p>
            </div>
          )}
        </div>

        <div className="glass-card input-card">
          <div className="section-title">
            <span>03</span>
            <div>
              <h2>Resume Match</h2>
              <p>Analyze one resume against the same job description.</p>
            </div>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
            />
            <strong>{resumeFile ? resumeFile.name : "Choose resume file"}</strong>
            <small>Supported: PDF, DOCX</small>
          </label>

          <button onClick={analyzeResume} disabled={resumeLoading}>
            {resumeLoading ? "Analyzing Resume..." : "Analyze Resume Match"}
          </button>
        </div>
      </section>
      

      {resumeResult?.result && (
        <section className="glass-card resume-report">
          <div className="section-title">
            <span>AI</span>
            <div>
              <h2>Resume Match Report</h2>
              <p>Individual resume analysis with missing skills and improvement suggestions.</p>
            </div>
          </div>

          <div className="resume-score-grid">
            <div className="metric-card">
              <h3>{resumeResult.result.match_score}%</h3>
              <p>Match Score</p>
            </div>
            <div className="metric-card">
              <h3>{resumeResult.result.recommendation}</h3>
              <p>Recommendation</p>
            </div>
          </div>

          <div className="two-column">
            <div>
              <h4>Matched Skills</h4>
              <div className="skill-chip-wrap">
                {(resumeResult.result.matched_skills || []).length > 0 ? (
                  resumeResult.result.matched_skills.map((skill, index) => (
                    <span key={index} className="skill-chip">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No matched skills found.</p>
                )}
              </div>
            </div>

            <div>
              <h4>Missing Skills</h4>
              <div className="skill-chip-wrap">
                {(resumeResult.result.missing_skills || []).length > 0 ? (
                  resumeResult.result.missing_skills.map((skill, index) => (
                    <span key={index} className="risk-chip">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No major missing skills found.</p>
                )}
              </div>
            </div>
          </div>

          <div className="two-column">
            <div>
              <h4>How To Improve</h4>
              <ul>
                {(resumeResult.result.improvement_suggestions || []).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4>Recommended Projects</h4>
              <ul>
                {(resumeResult.result.project_suggestions || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {results && (
        <section className="dashboard-section">
          <div className="dashboard-heading">
            <div>
              <span className="eyebrow">Interactive Recruiter Dashboard</span>
              <h2>Candidate Intelligence Center</h2>
              <p>
                Power BI-style recruiter dashboard with search, filters, analytics,
                explainability, and export.
              </p>
            </div>

            <button type="button" onClick={downloadDashboardCsv}>
              Download Ranked CSV
            </button>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <span>Total Returned</span>
              <strong>{candidates.length}</strong>
              <p>Top ranked profiles</p>
            </div>
            <div className="kpi-card">
              <span>Records Processed</span>
              <strong>{results.total_records || 0}</strong>
              <p>Dataset size</p>
            </div>
            <div className="kpi-card">
              <span>Top Score</span>
              <strong>{candidates[0]?.dynamic_score || 0}</strong>
              <p>Best candidate fit</p>
            </div>
            <div className="kpi-card">
              <span>Average Score</span>
              <strong>{averageScore}</strong>
              <p>Returned candidate average</p>
            </div>
            <div className="kpi-card">
              <span>Recommended</span>
              <strong>{recommendedCount}</strong>
              <p>Strong or recommended</p>
            </div>
            <div className="kpi-card">
              <span>Avg Confidence</span>
              <strong>{averageConfidence}%</strong>
              <p>{strongConfidenceCount} strong confidence</p>
            </div>
          </div>

          <div className="filter-bar">
            <input
              type="search"
              placeholder="Search by role, company, location, skill, or candidate ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              value={recommendationFilter}
              onChange={(event) => setRecommendationFilter(event.target.value)}
            >
              <option value="all">All Recommendations</option>
              {recommendationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min score"
              value={minScore}
              onChange={(event) => setMinScore(event.target.value)}
            />
          </div>

          {candidates.length === 0 && <p>No candidates found.</p>}

          {candidates.length > 0 && (
            <div className="dashboard-layout">
              <aside className="candidate-list-panel">
                <div className="panel-title">
                  <h3>Top Candidates</h3>
                  <span>{filteredCandidates.length} shown</span>
                </div>

                <div className="candidate-card-grid">
                  {filteredCandidates.map((candidate, index) => (
                    <button
                      key={candidate.candidate_id || index}
                      className={`mini-candidate-card ${
                        String(selectedCandidate?.candidate_id) ===
                        String(candidate.candidate_id)
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedCandidateId(String(candidate.candidate_id))
                      }
                    >
                      <div className="mini-card-top">
                        <span className="rank-badge">#{index + 1}</span>
                        <span className="score-pill">
                          {candidate.dynamic_score || 0}
                        </span>
                      </div>
                      <strong>{candidate.title || "Unknown Title"}</strong>
                      <small>{candidate.company || "N/A"}</small>
                      <p>{candidate.location || "Location not available"}</p>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="candidate-detail-panel">
                <div className="slicer-row">
                  <label htmlFor="candidate-slicer">Candidate Slicer</label>
                  <select
                    id="candidate-slicer"
                    value={selectedCandidate?.candidate_id || ""}
                    onChange={(event) => setSelectedCandidateId(event.target.value)}
                  >
                    {filteredCandidates.map((candidate, index) => (
                      <option
                        key={candidate.candidate_id || index}
                        value={candidate.candidate_id}
                      >
                        #{index + 1} - {candidate.title || "Unknown"} | Score{" "}
                        {candidate.dynamic_score || 0}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCandidate && (
                  <div className="selected-dashboard">
                    <div className="profile-card">
                      <div className="profile-header">
                        <div>
                          <span className="rank-badge">
                            Candidate {selectedCandidate.candidate_id || "N/A"}
                          </span>
                          <h3>{selectedCandidate.title || "Unknown Title"}</h3>
                          <p>
                            {selectedCandidate.company || "N/A"} •{" "}
                            {selectedCandidate.location || "N/A"}
                          </p>
                        </div>

                        <div className="score-gauge">
                          <strong>{selectedCandidate.dynamic_score || 0}</strong>
                          <span>Dynamic Score</span>
                        </div>
                      </div>

                      <div className="profile-meta-grid">
                        <div>
                          <span>Experience</span>
                          <strong>{selectedCandidate.experience || 0} years</strong>
                        </div>
                        <div>
                          <span>Recommendation</span>
                          <strong>
                            {selectedCandidate.hiring_recommendation?.recommendation ||
                              "Pending"}
                          </strong>
                        </div>
                        <div>
                          <span>Confidence</span>
                          <strong>
                            {selectedCandidate.hiring_recommendation?.confidence ||
                              selectedCandidate.explainability?.confidence ||
                              0}
                            %
                          </strong>
                        </div>
                      </div>

                      <p className="reason">
                        <strong>Reason:</strong>{" "}
                        {selectedCandidate.reason || "No reason available"}
                      </p>
                    </div>

                    <div className="chart-card">
                      <h3>Score Breakdown</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={scoreChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                      <h3>Top 10 Score Trend</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={rankTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="rank" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                      <h3>Skill Match Overview</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={skillChartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            label
                          >
                            {skillChartData.map((entry, index) => (
                              <Cell
                                key={`${entry.name}-${index}`}
                                fill={["#22d3ee", "#7c3aed", "#3b82f6", "#f59e0b"][index % 4]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="insight-card">
                      <h4>Why Selected</h4>
                      <ul>
                        {(selectedCandidate.explainability?.why_selected || []).length >
                        0 ? (
                          selectedCandidate.explainability.why_selected.map(
                            (item, index) => <li key={index}>{item}</li>
                          )
                        ) : (
                          <li>No detailed explanation available.</li>
                        )}
                      </ul>
                    </div>

                    <div className="insight-card">
                      <h4>Matched JD Skills</h4>
                      <div className="skill-chip-wrap">
                        {(selectedCandidate.jd_skill_matches || []).length > 0 ? (
                          selectedCandidate.jd_skill_matches.map((skill, index) => (
                            <span key={index} className="skill-chip">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p>No matched skills available.</p>
                        )}
                      </div>
                    </div>

                    {selectedCandidate.hiring_recommendation && (
                      <div className="insight-card wide">
                        <h4>AI Hiring Recommendation</h4>

                        <div className="recommendation-grid">
                          <div>
                            <span>Status</span>
                            <strong>
                              {
                                selectedCandidate.hiring_recommendation
                                  .recommendation
                              }
                            </strong>
                          </div>
                          <div>
                            <span>Confidence</span>
                            <strong>
                              {selectedCandidate.hiring_recommendation.confidence}%
                            </strong>
                          </div>
                        </div>

                        <p>{selectedCandidate.hiring_recommendation.decision}</p>

                        <div className="two-column">
                          <div>
                            <h5>Strengths</h5>
                            <ul>
                              {(
                                selectedCandidate.hiring_recommendation.strengths ||
                                []
                              ).map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5>Risks</h5>
                            <ul>
                              {(
                                selectedCandidate.hiring_recommendation.risks || []
                              ).map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="insight-card wide">
                      <h4>Interview Questions</h4>
                      <button
                        type="button"
                        onClick={() => generateInterviewQuestions(selectedCandidate)}
                      >
                        Generate Interview Questions
                      </button>

                      {interviewQuestions[selectedCandidate.candidate_id] && (
                        <ol>
                          {interviewQuestions[selectedCandidate.candidate_id].map(
                            (question, index) => (
                              <li key={index}>{question}</li>
                            )
                          )}
                        </ol>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default App
