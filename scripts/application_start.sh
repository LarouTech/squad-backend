#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# sudo apt-get update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# sudo apt install ruby-full
# sudo apt install wget
# cd /home/ubuntu|| exit
# wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
# sudo ./install auto > /tmp/logfile


# sudo apt-get update -y
# sudo apt-get install nginx -y
# sudo systemctl status nginx
# sudo systemctl enable nginx
sudo rm /etc/nginx/sites-available/default
sudo cp /home/ubuntu/project/nginx-default-config /etc/nginx/sites-available/default



# npm install pm2 -g
# pm2 startup
# sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.4.1/bin /home/ubuntu/.nvm/versions/node/v16.4.1/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
cd /home/ubuntu/project || exit
pm2 start dist/main.js -f
sudo systemctl restart nginx
