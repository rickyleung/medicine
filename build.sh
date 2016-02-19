#!/bin/sh

version=$(date +%s)

# add version for css
sed -i "s/all.css/all.css?v=$version/g" ./index.jsp

# add version for js
sed -i "s/app.js/app.js?v=$version/g" ./index.jsp

# add version for tpl
sed -i "s/version/$version/g" ./src/lib/jquery.mustache.js

# merge css
for file in $(ls ./asset/css/all.css)
do
    cat "${file}" | awk -F '"' '{print "./asset/css/" $2}' | xargs cat > "${file}.merge"
    rm "${file}"
    mv "${file}.merge" "${file}"
    echo "${file} merged"
done

# merge and compress js
for file in $(ls ./asset/js/*.js)
do
    cat "${file}" | awk -F '"' '{print substr($2,1)}' | xargs cat > "${file}.merge"
    rm "${file}"
    mv "${file}.merge" "${file}"
    echo "${file} merged"

    $JAVA_HOME/bin/java -jar ./tool/yuicompressor.jar "${file}" --charset utf-8 -o "${file}.compress"
    rm "${file}"
    mv "${file}.compress" "${file}"
    echo "${file} compressed"
done