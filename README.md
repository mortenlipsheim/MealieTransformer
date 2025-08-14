# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

##### .env.local
```
MEALIE_URL=https://YOURDOMAIN.com
MEALIE_API_TOKEN=malietoken
GEMINI_API_KEY=Gemini-API-Key
```


### Install node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node -v
npm -v

### On the Linux server
```
cd /BaseDirectory/name (e.g. firebase)
git clone https://github.com/mortenlipsheim/MealieTransformer
cd MealieTransformer
npm install
nano .env.local #(add necessary variables)
npm run build
npm run start # (running interactive) (add -- -p 9002 to specify port)
```

##### In background
(Only once per server)
sudo npm install pm2 -g

(go into the project directory)
pm2 start npm --name "MealieTransformer" -- start

##### After a change:
cd /MealieTransformer
git pull origin main
npm install
npm run build

If using pm2: pm2 restart MealieTransformer (or pm2 restart all)

OR

npm run start -- -p 9003 (if you want to specify the port)
