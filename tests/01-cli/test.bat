@echo off

rem :: declare variables "IBM_TRANSLATOR_API_KEY" and "IBM_TRANSLATOR_API_URL"
call "%USERPROFILE%\IBM_TRANSLATOR_API_CREDENTIALS.bat"

set DIR=%~dp0.
goto :start

:ibm-translate
  call node "%DIR%\..\..\bin\ibm-translate.js" %*
  goto :eof

:start
set output_dir=%DIR%\output
set log_file="%output_dir%\test.log"

if not exist "%output_dir%" mkdir "%output_dir%"
if exist %log_file% del %log_file%

call :ibm-translate -i "en" -o "de" -s "Hello world"            >>%log_file% 2>&1
call :ibm-translate -i "en" -o "de" -s "Welcome to the jungle"  >>%log_file% 2>&1

rem :: test invalid input
call :ibm-translate -i "xx" -o "de" -s "Hello" >>%log_file% 2>&1
call :ibm-translate -i "en" -o "yy" -s "Hello" >>%log_file% 2>&1
