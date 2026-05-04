---
title: "Azure DevOps Pipelines for .NET"
date: 2026-05-03
category: devops
tags: [azure, devops, ci-cd]
description: "Setting up CI/CD pipelines for .NET projects"
---

# Azure DevOps Pipelines for .NET

Learn how to set up automated builds and deployments for your .NET projects.

## Basic Pipeline Structure

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'windows-latest'

steps:
  - task: UseDotNet@2
    inputs:
      packageType: 'sdk'
      version: '8.0.x'

  - task: DotNetCoreCLI@2
    inputs:
      command: 'restore'
      projects: '**/*.csproj'

  - task: DotNetCoreCLI@2
    inputs:
      command: 'build'
      projects: '**/*.csproj'
      arguments: '--configuration Release'

  - task: DotNetCoreCLI@2
    inputs:
      command: 'test'
      projects: '**/*Tests.csproj'
```

## Deployment to Azure App Service

```yaml
  - task: AzureRmWebAppDeployment@4
    inputs:
      AppServiceName: 'my-app-service'
      Package: '$(System.DefaultWorkingDirectory)/**/*.zip'
      PublishWebProjects: false
      LaunchWebsiteAfterDeployment: true
```

## Conclusion

Azure DevOps provides powerful CI/CD capabilities for .NET projects. Start automating your builds today!

---

**Questions?** Check out our [Tutorials](/posts/tutorials) for more DevOps content!
