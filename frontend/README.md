#### Prepare the Source Codes

<pre>
git clone https://github.com/kyeoungwoon/sesac-community.git
</pre>

#### Prepare the Configuration File

- Prepare the <code>backend/config.json</code> file.
<pre>
{
    "db_string": {MongoDB Database String},
    "jwt_key": {JWT Secret Key}
}
</pre>

- Edit the <code>frontend/src/configs/api.json</code> file
<pre>
{
    "URL": "{YOUR BACKEND URL}"
}
</pre>

#### Install and Start the Server Application

<pre>
cd backend
npm install
npm run start
</pre>

#### Install and Start the Client Application

<pre>
cd frontend
npm install
npm start
</pre>

#### Usage

- Connect the website <code>http://YOUR.WEBSITE/</code>.
