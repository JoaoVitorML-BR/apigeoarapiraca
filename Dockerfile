FROM node:22-alpine3.19

#directory to work
WORKDIR /usr/app 
 
#Copy all files that initialize with package and the end is .json to path /usr/app
COPY package*json ./ 

#command to install all dependences
RUN npm install

#copy all files to /usr/app
COPY . .

#Port to access
EXPOSE  1952

#command to run server
CMD ["npm", "start"]