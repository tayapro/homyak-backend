echo "starting Mongosh...."
docker run -it --rm \
    --net homyak.net \
    --name mongosh \
    rtsp/mongosh:1.4.2 \
    mongosh mongodb://sti:boss@mongo:27017/admin
