const input = document.getElementById("file");
        const errorBox = document.getElementById('error')
        const loading = document.getElementById('load')

        const key = "ea97f7d66e4d4b4eec3608b1c3db5c36";

        let summary = null;

        const acceptedDoc = ['docs', 'docx', 'pdf', 'txt']

        document.getElementById('sum').addEventListener('submit', async(e) => {
            e.preventDefault()

            
            try{
                
                if(!input.files[0]) {
                    errorBox.innerText="Upload a valid document"
                    setTimeout(3000, function() {
                        errorBox.innerText = " "
                    })
                } else{ 
                    errorBox.innerText=" "
                    if(acceptedDoc.includes(input.files[0].type.split('/')[1].toLowerCase())) {

                        loading.style.display = 'flex'

                        const formdata = new FormData();
                        formdata.append("key", key);
                        formdata.append("doc", input.files[0]);
                        formdata.append("sentences", 30);

                        const requestOptions = {
                        method: 'POST',
                        body: formdata,
                        redirect: 'follow'
                        };

                        const response = await fetch("https://api.meaningcloud.com/summarization-1.0", requestOptions)

                        const results = await response.json()

                        console.log(results)

                        if(results.status.msg === 'OK') {
                            loading.style.display = 'none'
                            document.getElementById('ready').style.display = 'block';
                            summary = results.summary
                        } else{
                            loading.style.display = 'none'
                            errorBox.innerText=results.status.msg
                            summary = results.summary
                        }
                    } else{
                        
                        errorBox.innerText="Unsupported File Format"
                        setTimeout(3000, function() {
                            errorBox.innerText = " "
                        })
                    }
                }
                
            } catch(err) {
                loading.style.display = 'none'
                console.log(err)
                errorBox.innerText="Something went wrong, check file and try again"

                setTimeout(3000, function() {
                        errorBox.innerText = " "
                    })
            }
        }
    )

    document.getElementById('download').addEventListener('click', () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        var splitTitle = doc.splitTextToSize(summary, 193);
        doc.text(10, 10, splitTitle);
        doc.save(`summary_${Date.now()}.pdf`);
    })