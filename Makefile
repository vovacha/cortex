build: build-mac archive upload clean

build-mac:
	yarn tauri build --target universal-apple-darwin

archive:
	@zip -q Cortex.zip src-tauri/target/universal-apple-darwin/release/Cortex

upload:
	@echo $(shell curl -sS --upload-file Cortex.zip https://transfer.sh/Cortex.zip)

clean:
	@rm Cortex.zip
