USERNAME=$1
PASSWORD=$2
MYHOST=3.248.181.108

if [ -z $USERNAME ] || [ -z $PASSWORD ]; then
  echo "Usage: $(basename $0) <username> <password>"
  exit 1
fi

curl -Sis -X POST \
  -H "Content-Type: application/json" \
  http://$MYHOST:3001/api/login \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}"

echo