\# Automation AI Agent Projects



This repository contains AI automation and full-stack AI projects.



\## Main Hackathon Project



\# AI Recruiter Agent



AI Recruiter Agent is a full-stack AI-powered recruitment platform built for the Redrob Intelligent Candidate Discovery \& Ranking Challenge.



\## Project Folder



\[AI Recruiter Agent](./AI-Recruiter-Agent)



\## Live Links



Frontend: https://ai-recruiter-agent-frontend.onrender.com/



Backend API: https://ai-recruiter-backend-7vet.onrender.com/docs



Medium Article: https://medium.com/@ayushrajput8404/how-i-built-an-ai-recruiter-agent-from-hackathon-problem-to-full-stack-ai-product-e8feb9281cf2



Portfolio: https://data-analysis-portfolio-six.vercel.app/



\## Reproduce Hackathon Submission



```bash

cd AI-Recruiter-Agent/backend

python rank.py --candidates candidates.jsonl --out outputs/submission.csv

python validate\_submission.py outputs/submission.csv

