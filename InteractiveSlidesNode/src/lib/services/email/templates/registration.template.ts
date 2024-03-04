import { link } from 'fs'

export const registrationTemplate = (data: { email: string, password: string, link: string }) => {
  return `
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <meta http-equiv='X-UA-Compatible' content='ie=edge' />
    <title>SlideX Registration</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        padding: 0;
        margin: 0;
      }
      header {
        width: 100%;
        background: linear-gradient(
          180deg,
          rgba(255, 86, 48, 1) 0%,
          rgba(255, 255, 255, 1) 100%
        );
        height: 4.5rem;
        padding: 1rem;
      }
      header img {
        display: block;
        height: 100%;
      }
      h1,
      h2 {
        text-align: center;
      }
      .credentials {
        font-size: 1.5rem;
        text-align: center;
        font-weight: 500;
        background-color: #d6d6d6;
        width: fit-content;
        margin: 1.25rem auto;
        padding: 2.5rem;
        border-radius: 0.5rem;
      }
    </style>
  </head>
  <body>
    <header>
      <img
        src='https://slidex.ai/wp-content/uploads/2023/09/Slidex-logo-new-360-x-90-px-360-x-120-px.png'
        alt='slidex-logo'
      />
    </header>
    <main>
      <h1>
        You were successfully registered to the SlideX
      </h1>
      <div>
        <div>
          <h2>Please use your credentials</h2>
        </div>
        <div class='credentials'>Email: ${data.email} <br /> Temporary password: ${data.password} <br/> Your link to change password <a href=${data.link} target="_blank">Click here!</a>
        </div>
      </div>
    </main>
  </body>
</html>`
}
