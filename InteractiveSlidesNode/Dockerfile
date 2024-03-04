FROM node:18.9

RUN wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN rm packages-microsoft-prod.deb


RUN apt-get update && apt-get install -y dotnet-runtime-7.0

#RUN sed -i'.bak' 's/$/ contrib/' /etc/apt/sources.list
#RUN apt-get update; apt-get install -y ttf-mscorefonts-installer fontconfig
#RUN wget https://github.com/google/fonts/archive/main.tar.gz -O gf.tar.gz && \
#  tar -xf gf.tar.gz && \
#  mkdir -p /usr/share/fonts/truetype/google-fonts && \
#  find $PWD/fonts-main/ -name "*.ttf" -exec install -m644 {} /usr/share/fonts/truetype/google-fonts/ \; || return 1 && \
#  rm -f gf.tar.gz && \
#  # Remove the extracted fonts directory
#  rm -rf $PWD/fonts-main && \
#  # Remove the following line if you're installing more applications after this RUN command and you have errors while installing them
#  rm -rf /var/cache/* && \
#  fc-cache -f

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:addin
RUN npm run build


CMD ["node", "dist/entrypoint.js"]
