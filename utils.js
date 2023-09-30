// Linear interpolation
function lerp(A, B, p) {
    return A + (B - A) * p;
}

/**
 * 
 * @param {Object} A The starting point of the first line
 * @param {Number} A.x The x coordinate of A
 * @param {Number} A.y The y coordinate of A
 * @param {Object} B The ending point of the first line
 * @param {Number} B.x The x coordinate of B
 * @param {Number} B.y The y coordinate of B
 * @param {Object} C The starting point of the second line
 * @param {Number} C.x The x coordinate of C
 * @param {Number} C.y The y coordinate of C
 * @param {Object} D The ending point of the second line
 * @param {Number} D.x The x coordinate of D
 * @param {Number} D.y The y coordinate of D
 * @returns {Object | null}
 */
function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if(bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            }
        }
    }
    return null;
}

function polysIntersect(poly1, poly2) {
    for(let i = 0; i < poly1.length; i++) {
        for(let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length],
            );

            if(touch) {
                return true;
            }
        }
    }

    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;

    return `rgba(${R}, ${G}, ${B}, ${alpha})`;          
}