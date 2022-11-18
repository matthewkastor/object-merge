cmd /c npm install
pause
rem cmd /c npm run-script srcFormat
cmd /c npm run-script lint
cmd /c npm run-script test
pause
cmd /c npm run-script buildBrowserModule
pause
cmd /c npm run-script buildVsdocs
cmd /c npm run-script buildDocs
pause