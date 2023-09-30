class Visualizer{
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - 2 * margin;
        const height = ctx.canvas.height - 2 * margin;

        const levelHeight = height / network.levels.length;
        for(let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(
                height - levelHeight,
                0,
                (network.levels.length === 1) 
                ? 0.5 
                : i / (network.levels.length - 1)
            );

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(
                ctx, network.levels[i],
                left, levelTop,
                width, levelHeight,
                i === network.levels.length - 1 ? ['⬆', '⬅', '➡', '⬇'] : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;
        const nodeRadius = 18;

        const {inputs, outputs, weights, biases} = level;

        
        // Show the connections
        for(let i = 0; i < inputs.length; i++) {
            for(let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom,
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top,
                );
                ctx.lineWidth = 2;

                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        // Show input layer
        for(let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        // Show output layer
        for(let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'black';
            ctx.fill()

            
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius *  0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            if(outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign='center';
                ctx.textBaseline='middle';
                ctx.strokeStyle='white';
                ctx.fillStyle='black';
                ctx.font=(nodeRadius*1.5) + 'px Arial';
                ctx.lineWidth=0.5;
                ctx.fillText(outputLabels[i], x, top);
                ctx.strokeText(outputLabels[i], x, top);
            }
        }
    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left, 
            right, 
            nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}