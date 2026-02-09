# Institute management frontend

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/yaseens-projects-05363b65/v0-institute-management-frontend)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/vP5YJtcnj2Z)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/yaseens-projects-05363b65/v0-institute-management-frontend](https://vercel.com/yaseens-projects-05363b65/v0-institute-management-frontend)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/vP5YJtcnj2Z](https://v0.app/chat/vP5YJtcnj2Z)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository


graph TD
    %% Main Node
    Root[RGM] --> Rel1(Courses)
    
    %% Level 1: Courses
    Rel1 --> Branch1[CSE]
    Rel1 --> Branch2[ECE]
    Rel1 --> Branch3[EEE]
    
    %% Level 2: Grades (Connected to ECE in the sketch)
    Branch2 --> Rel2(Grades)
    
    %% Level 3: Semesters
    Rel2 --> Sem1[Sem 1]
    Rel2 --> Sem2[Sem 2]
    Rel2 --> Sem3[Sem 3]
    Rel2 --> Sem4[Sem 4]
    
    %% Level 4: Section (Connected to Sem 2 in the sketch)
    Sem2 --> Rel3(Section)
    
    %% Level 5: Sections
    Rel3 --> SecA[A-Sec]
    Rel3 --> SecB[B-Sec]

    %% Styling to match the logic
    classDef relation fill:#f9f,stroke:#333,stroke-width:2px;
    class Rel1,Rel2,Rel3 relation;



graph TD
    %% Main Node
    Root[Sri Lakshmi School] --> Rel1(Courses)
    
    %% Level 1: Courses (Curriculum/Board)
    Rel1 --> Board1[CBSE]
    Rel1 --> Board2[ICSE]
    Rel1 --> Board3[SSC]
    
    %% Level 2: Grades (Connected to ICSE in the sketch)
    Board2 --> Rel2(Grades)
    
    %% Level 3: Specific Grades
    Rel2 --> G1[I]
    Rel2 --> G2[II]
    Rel2 --> G3[III]
    Rel2 --> G4[IV]
    
    %% Level 4: Section (Connected to Grade II in the sketch)
    G2 --> Rel3(Section)
    
    %% Level 5: Sections
    Rel3 --> SecA[A-Sec]
    Rel3 --> SecB[B-Sec]

    %% Styling for clarity
    classDef relation fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    class Rel1,Rel2,Rel3 relation;


graph TD
    %% Main Node
    Root[Space Junior College] --> Rel1(Courses)
    
    %% Level 1: Courses (Curriculum/Board)
    Rel1 --> Board1[CBSE]
    Rel1 --> Board2[ICSE]
    Rel1 --> Board3[SSC]
    
    %% Level 2: Grades (Connected to ICSE in the sketch)
    Board2 --> Rel2(Grades)
    
    %% Level 3: Specific Grades
    Rel2 --> G1[I]
    Rel2 --> G2[II]
    
    %% Level 4: Section (Connected to Grade II in the sketch)
    G2 --> Rel3(Section)
    
    %% Level 5: Sections
    Rel3 --> SecA[MPC-A-Sec]
    Rel3 --> SecB[MPC-B-Sec]
    Rel3 --> SecB[BiPC-A-Sec]

    %% Styling for clarity
    classDef relation fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    class Rel1,Rel2,Rel3 relation;
