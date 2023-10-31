build: build-mac archive upload clean

build-mac:
	pnpm tauri build --target universal-apple-darwin

archive:
	@zip -q Concierge.zip src-tauri/target/universal-apple-darwin/release/Concierge

upload:
	@echo $(shell curl -sS --upload-file Concierge.zip https://transfer.sh/Concierge.zip)

clean:
	@rm Concierge.zip
