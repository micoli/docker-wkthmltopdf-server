FROM node:13.10.1-stretch-slim

RUN apt-get update &&\
    apt-get install -y \
        curl \
        libxrender1 \
        libfontconfig \
        libxtst6 \
        xz-utils &&\
    curl "https://downloads.wkhtmltopdf.org/0.12/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz" -L -o "wkhtmltopdf.tar.xz" &&\
    tar Jxvf wkhtmltopdf.tar.xz &&\
    mv wkhtmltox/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf &&\
    mv wkhtmltox/bin/wkhtmltoimage /usr/local/bin/wkhtmltoimage &&\
    rm -rf wkhtmltox wkhtmltopdf.tar.xz &&\
    apt-get clean;apt-get autoremove

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]
