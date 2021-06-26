![screenshot](https://raw.githubusercontent.com/amirkabiri/website-indexer/master/screenshot.png)

# Introduction
This is a simple search engine website that crawls and indexes web pages and does rank retrieval on the user search query.
about 1000 pages of famous Github pages have been indexed.

# Run using docker
Image of this app has been hosted on dockerhub:
**amirkabiri/website-indexer:compact**
web server starts on port 3000.
so you can run a command like this:
`docker run -p 80:3000 amirkabiri/website-indexer:compact`
then open http://localhost:80 in your browser.