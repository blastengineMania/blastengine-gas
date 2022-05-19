# blastengine SDK for Google Apps Script

## Install

ID: 1GvJKygDvrhoq9w1FIRepBo1kAB3yo1LucHtL6CIM-KqmaFaxLUbyBdim

## Usage

### Initialize

```js
Blastengine.init('YOUR_USER_NAME', 'YOUR_API_KEY');
```

### Transaction

```js
const transaction = Blastengine.transaction();
```

#### Text email

```js
transaction.fromEmail = 'info@example.com';
transaction.setTo('user@example.jp');
transaction.subject = 'Test subject';
transaction.setText('Test body');
const res = transaction.send();
console.log(res);
// { delivery_id: 188 }
```

### Attachments

```js
const file = DriveApp.getFileById('DRIVE_FILE_ID');
const response = UrlFetchApp.fetch('https://example.com/logo.jpg');
```

File attached.

```js
transaction.addAttachment(file.getBlob());
transaction.addAttachment(response.getBlob());
```

```js
const res = transaction.send();
console.log(res);
// { delivery_id: 189 }
```

### Bluk email

```js
const bulk = Blastengine.bulk();
```

#### Save email

```js
bulk.fromEmail = 'info@example.com';
bulk.subject = 'Test subject';
bulk.setText('Text body with  __name__');
const res =  bulk.register();
console.log(res);
// { delivery_id: 189 }
```

#### Add to

```js
bulk.setTo('user1@example.jp', {
	'name': 'User 1',
});
bulk.setTo('user2@example.jp', {
	'name': 'User 2',
});
bulk.update();
```

#### Send email

```js
bulk.send();
```

#### Delete bulk email

```js
bulk.delete();
```

## License

MIT
