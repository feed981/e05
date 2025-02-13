# frontend

## index.b.html

```
<script src="./static/script/script.js"></script>
<!--for cloudfront  <script src="https://d2luynvj2paf55.cloudfront.net/6974850989e8a6a37d36f56eee8fe955.min.js"></script> -->
```

html-minifier
 
```sh
cd ./nginx/html
html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true -o index.html index.b.html
```

## nginx.conf

```
    location / {
      root /usr/share/nginx/html; 
      index index.html;
    }
```

# vagrant
 
mapping

```ruby
  config.vm.synced_folder "D:/local/workspace/cry/nginx", "/vagrant/nginx"
```