# Weather API Application

## Main Technology Stack

<p>
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="100"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/NestJS.svg" width="100"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" width="100"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/RabbitMQ_logo.svg" width="100"/>
</p>


## What Has Been Implemented
<p>
  Created two microservices: <strong>Weather</strong> and <strong>Subscription</strong>.
  Each of them has its own logic and stores data in a <strong>PostgreSQL</strong> database.
</p>

<p>
  There is also an <strong>API Gateway</strong>, which receives <strong>HTTP requests</strong> from the client side (frontend)
  and communicates with the services using <strong>RabbitMQ</strong>.
</p>
<img src="https://github.com/user-attachments/assets/9badde7a-0fb4-4c8e-89d2-1c13b8c8dc00" width="90%"/>

<p>
  The application was deployed using <strong>Render</strong>: 
  <a href="https://weather-api-application-97ys.onrender.com" target="_blank">Weather Application</a>
</p>

## Example of Use
<blockquote>
  The user fills out the subscription form by entering their email and selecting a city and frequency (daily/hourly).
  After submitting, a confirmation email is sent.
</blockquote>
<img src="https://github.com/user-attachments/assets/fe399560-82b4-4f24-966c-f4fb9eb9d140" width="90%"/>
<blockquote>
  Example of the confirmation email received by the user:
</blockquote>
<img src="https://github.com/user-attachments/assets/b28ef2bb-17ac-4b79-9d39-ee4d2d026b02" width="30%"/>

## What Needs to Be Done / Fixed

<ul>
  <li><strong>Fix email confirmation/unsubscribe links</strong><br/>
      Pages work locally, but the links in the emails point to incorrect or non-public URLs in production.
  </li>
  <li><strong>Implement scheduled email delivery</strong><br/>
      Emails should be automatically sent based on the selected subscription frequency: <code>daily</code> or <code>hourly</code>.
  </li>
</ul>

## API Testing with Postman
<details>
  <summary>Weather</summary>
    <img src="https://github.com/user-attachments/assets/b70c35b1-c352-4353-825e-ebb02f5de537" width="90%"/>
    <img src="https://github.com/user-attachments/assets/e500887e-27e7-4335-907e-e5df9124d31e" width="90%"/>
    <img src="https://github.com/user-attachments/assets/31a42031-f1eb-4fc0-a817-d05172b35159" width="90%"/>
</details>
<details>
  <summary>Subscription</summary>
    <img src="https://github.com/user-attachments/assets/b35eec9b-b470-429a-b858-a474078860ce" width="90%"/>
    <img src="https://github.com/user-attachments/assets/8e2db6cb-018e-4242-8db9-c98f04013f72" width="90%"/>
    <img src="https://github.com/user-attachments/assets/905ecee8-da60-43e8-9a95-07cc368a9a4d" width="90%"/>
    <img src="https://github.com/user-attachments/assets/356d460b-5fd1-41ef-8d3e-80ce034be145" width="90%"/>
    <img src="https://github.com/user-attachments/assets/776aed0f-2b3b-4f8b-851c-2ed3f31432ff" width="90%"/>
    <img src="https://github.com/user-attachments/assets/e50dace7-fea6-40c1-b3a1-6446978ea548" width="90%"/>
</details>

## Local Setup

<ol>
  <li>
    <p>Clone the repository:</p>
    <code>git clone https://github.com/vikkyvl/weather-api-application.git</code>
  </li>

  <li>
    <p>Create required <code>.env</code> files for each service.</p>
  </li>
  <li>
    From the root directory, run:<br/>
    <code>docker-compose up --build</code>
  </li>
</ol>


# Main Branch Protection Ruleset

This repository uses **reinforced protection rules** on the `main` branch to ensure code quality, collaboration discipline, and production stability.

## Protected Branch: `main`

The following rules are **actively enforced**:

---

## Required Pull Requests

All changes to `main` must be submitted via Pull Requests (PRs) and meet the following requirements:

- **Minimum 2 approving code reviews**
- **Code owners must review the PR**
- **All review threads must be resolved before merging**
- **Stale reviews are dismissed if new commits are pushed**

### Allowed merge methods:
- Merge commit
- Squash merge
- Rebase merge

---

## Required Status Checks

A pull request cannot be merged unless all of the following CI checks **pass**:

- `lint`
- `unit-tests`
- `integration-tests`

> These checks are integrated via CI system (integration_id: `15368`).

---

## Commit & History Rules

- **Force-pushes are disabled**
- **Branch deletion is disabled**

> This ensures every commit is traceable and no rewriting occurs on `main`.

---

## Branch Creation Rules

- New branches from `main` can be created.
- Updates via PRs only — no direct push access.

---

## Who Can Bypass These Rules?

- **No one.**  
  There are currently **no bypass actors** defined — rules apply to all collaborators equally.

---

## Notes for Contributors

Please make sure to:
1. Fork or create a feature branch.
2. Commit with meaningful messages.
3. Push and create a Pull Request targeting `main`.
4. Wait for CI checks and 2 approvals (including code owner, if applicable).
5. Merge using the allowed methods (squash is required for clarity).

---

For questions or to request a temporary exception, contact the repository maintainers or admins.
