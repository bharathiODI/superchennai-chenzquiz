

export default function CodeBlock({ node }: any) {
  const code = node.fields?.code
  const language = node.fields?.language

  if (!code) return null

  /* ---------------- HTML PREVIEW ---------------- */
  if (language === 'html') {
    return (
      <div className="my-10 overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
        <iframe
          title="html-preview"
          className="w-full min-h-[600px] bg-white"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <!-- Tailwind -->
                <script src="https://cdn.tailwindcss.com"></script>

                <style>
                  body{
                    margin:0;
                    padding:20px;
                    font-family:sans-serif;
                    background:#fff;
                  }
                </style>
              </head>

              <body>
                ${code}
              </body>
            </html>
          `}
        />
      </div>
    )
  }

  /* ---------------- CSS PREVIEW ---------------- */
  if (language === 'css') {
    return (
      <iframe
        title="css-preview"
        className="w-full min-h-[100%] bg-white"
        sandbox="allow-scripts"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
               
                ${code}
              </style>
            </head>

            <body>
              <div class="card">
                <h1>Hello World</h1>
                <button>Button</button>
              </div>
            </body>
          </html>
        `}
      />
    )
  }

  /* ---------------- JS PREVIEW ---------------- */
  if (language === 'javascript') {
    return (
      <iframe
        title="js-preview"
        className="w-full min-h-[300px] rounded-2xl bg-black"
        sandbox="allow-scripts"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <body style="">
              <div id="output"></div>

              <script>
                const output = document.getElementById('output');

                const log = console.log;

                console.log = (...args) => {
                  output.innerHTML += args.join(' ') + '<br />';
                  log(...args);
                };

                try {
                  ${code}
                } catch(err) {
                  output.innerHTML += '<span style="color:red">' + err + '</span>';
                }
              </script>
            </body>
          </html>
        `}
      />
    )
  }

  /* ---------------- FALLBACK ---------------- */
  return (
    <pre className="bg-black text-green-400 p-6 rounded-2xl my-10 ">
      <code>{code}</code>
    </pre>
  )
}
