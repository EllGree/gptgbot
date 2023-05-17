build:
	docker build -t gptgbot .

run:
	docker run -d -p 3000:3000 --name gptgbot --rm gptgbot
