$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('F:\NGO APP\API Contracts\PUC Student Approval API Contract.docx')
$text = $doc.Content.Text
$doc.Close()
$word.Quit()
[System.IO.File]::WriteAllText('F:\NGO APP\App\VPApp\Docs\PUC_STUDENT_APPROVAL_API_CONTRACT.txt', $text, [System.Text.Encoding]::UTF8)
Write-Host "Done"
