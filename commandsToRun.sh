ionic cordova build browser --prod --release
echo "1"
git rm -rf docs
echo "2"
rm -rf docs
echo "3"
mkdir -p docs
echo "4"
cp -R www/* docs
echo "5"
cd docs
echo "6"
ln -s index.html 404.html
echo "7"
ln -s favicon.ico apple-touch-icon.png
echo "8"
ln -s favicon.ico apple-touch-icon-precomposed.png
echo "9"
cd ..
echo "10"
cp platforms/browser/config.xml docs/
echo "11"
cp .htaccess docs/
