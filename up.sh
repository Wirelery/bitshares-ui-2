npm run build && cd build && cd dist && git init && git remote add origin https://github.com/Wirelery/exchange && git add . && git commit -m "deployed by vs bot" && git push origin master -f && cd .. && cd .. && git add . && git commit -m "updated by vs bot" && git push origin develop