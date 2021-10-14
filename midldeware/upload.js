const aws = require('aws-sdk');

const s3 = new aws.S3({
	accessKeyId: `${process.env.ACCESS_KEY_ID}`,
	secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
});

module.exports = (req, res, next) => {
	async function getImage() {
		const data = s3
			.getObject({
				Bucket: 'bandits-blog-imgs',
				Key: `${image.key}`,
			})
			.promise();
		return data;
	}

	getImage()
		.then(img => {
			const imageUrl = `https://banditsblogimgs.s3.us-east-2.amazonaws.com/${image.key}`;
			return imageUrl;
		})
		.catch(err => {
			console.log(err);
		});
	next();
};
