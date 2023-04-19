# Steps to run the app ( without a container)

1. npm install
2. npm run start ( or npm run dev for development )

# Steps to run the app ( using a docker container)

1. docker build -t toolbox-api .
2. pwd (copy the out put and paste it in step 3)
3. docker run -d -v /absolutepath-to-your-backend-repo/toolbox-api:/app -p 3000:3000 toolbox-api
4. docker logs -f your-container-id-here
