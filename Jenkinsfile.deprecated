@Library ('folio_jenkins_shared_libs') _

buildNPM {
  publishModDescriptor = true
  runRegression = false
  npmDeploy = 'yes'
  runLint = true
  runSonarqube = true
  runScripts = [
   ['formatjs-compile': ''],
   ['test': ''],
  ]
}
