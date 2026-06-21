# Forge 2 Architecture

## Overview

This project uses a two-agent architecture:

### Hermes (Brain)

Hermes acts as the orchestrator and decision-maker.

Responsibilities:

* Planning tasks
* Maintaining memory across conversations
* Creating and managing autonomous cron jobs
* Breaking larger goals into smaller tasks
* Delegating execution work to OpenClaw

### OpenClaw (Hands)

OpenClaw acts as the execution agent.

Responsibilities:

* Executing coding tasks
* Creating and modifying files
* Running commands
* Interacting through Slack
* Reporting execution results

## Slack Channel Structure

### #sprint-main

Used for planning, decisions, and project coordination.

### #agent-coder

Used for coding tasks assigned to OpenClaw.

### #agent-log

Used for execution logs and audit trails.

### #all-forge-02-shreya

Primary testing channel used during qualification.

## Model Routing

Hermes:

* Planning and memory operations
* Autonomous task execution

OpenClaw:

* Code generation
* File operations
* Command execution

## Evidence Demonstrated

* Hermes memory recall
* Hermes autonomous cron execution
* OpenClaw file creation
* Slack integration for both agents
* Status-report skill implementation
