/* 	Object.values(req.files).forEach(file => {
			// @ts-ignore

			const { path, size, originalname, mimetype, buffer } = file;

			const name = `${generateCustomName(originalname)}${getExtension(mimetype)}`;
			let dest = join(project, userId, type, container, name);
			const createdAt: number = new Date().getTime();
			filePaths.push({ path: dest, originalname, size, mimetype, name, createdAt });
			dest = dest.replace(/\\/g, '/');

			const fileManager = new FilestoreFile();
			promises.push(fileManager.upload(file, path, dest));
		});
		await Promise.all(promises);

		// publish on firestore
		const id = await storeKnowledgeBox({ container, userId, knowledgeBoxId, docs: filePaths });

		const p = join(project, userId, type, container);
		//update embedding
		(async () => {
			try {
				const response = await model.update(p, { container });
				if (!response.status) setKnowledgeBox(id, { status: 'failed' });
				else setKnowledgeBox(id, { status: 'ready' });
			} catch (e) {
				setKnowledgeBox(id, { status: 'failed' });
			}
		})();

		res.json({
			status: true,
			data: { knowledgeBoxId: id, message: 'File(s) uploaded successfully' },
	 	});*/
