echo "starting homyak...."
docker run -d \
    -p 3000:3000 \
    --net homyak.net \
    --name homyak \
    -e MONGO_URL="mongodb://sti:boss@mongo:27017/admin" \
    sti80/homyak-backend:1.0.0