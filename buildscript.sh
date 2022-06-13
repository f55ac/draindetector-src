mv build/.git .
npm run build
mv ./.git build
cd build
git push git@github.com:f55ac/draindetector.git master
