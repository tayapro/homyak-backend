#MONGODB_URL=$(cat ../.env | grep ^MONGO_URL | awk -F= '{print $2}')
#MONGODB_URL="mongodb+srv://Stipaxa:dAhDIyylpU2j0TxLGvBi@homyak.quto1.mongodb.net/?retryWrites=true&w=majority"
MONGODB_URL="mongodb://sti:boss@mongo:27017/admin"
echo $MONGODB_URL
docker run -d \
    --name myid \
    --net homyak.net \
    -p 3001:3001 \
    -e MONGODB_URL="$MONGODB_URL" \
    -e ACCESS_TOKEN_LIFETIME="60m" \
    dsimakov/myid:0.1.1