@Library ('folio_jenkins_shared_libs') _

buildNPM {
  publishModDescriptor = true
  npmDeploy = 'yes'
  runLint = true
  runSonarqube = true
  runScripts = [
   ['formatjs-compile': ''],
  ]
  runTest = false
}
