# DDU App and Idle Quests Developer Guide

Welcome adventurer! In this document you will find a guide on setting up a local development environment and a general explanation of the current architecture.

## Local Environment Setup

1. Install [nodejs lts](https://nodejs.org/en/) on your local machine.
2. Install `docker` and `docker-compose`, we recommend installing [Docker for Desktop](https://www.docker.com/products/docker-desktop/) which includes both and a nice UI to manage your images.
3. Install `npm dependencies`, the frontend and backend are on different subprojects, therefore you need to enter each directory and run `npm install`.
4. Make a free [BlockFrost](https://blockfrost.io/) account and crete a free cardano `preprod` project and save the `api key`, you will need it on a further step.