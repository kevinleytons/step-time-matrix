
const fs = require("fs");

async function buildMatrix(lines) {
  return new Promise( async (resolve, reject) => {
    let matrix = await initMatrix( lines );
    matrix = await fillMatrix( matrix, lines )
    resolve( matrix );
  });
}

async function initMatrix( lines ) {
  return new Promise( (resolve, reject) => {
    let matrix = [];
    let AletterChar = 65;
    for ( let i = 0 ; i <= parseInt(lines[0]) ; i ++ ) {
      matrix.push([]);
      for ( let j = 0 ; j <= parseInt(lines[0]) ; j ++ ) {
        if ( i == 0 && j == 0 ) {
          matrix[i][j] = '/';
        } else {
          if ( i == 0 ) { matrix[i][j] = getChar(AletterChar++) }
          if ( j == 0 && i > 0) { matrix[i][j] = getChar( AletterChar - lines[0] + i - 1 ) }
          if ( i == j ) { matrix[i][j] = 'X' }
          if ( i != j && i != 0 && j != 0 ) { matrix[i][j] = '0' }
        }
      }
    }
    resolve(matrix);
  })
}

async function fillMatrix( matrix, lines ) {
  return new Promise( (resolve, reject) => {
    lines.shift()
    for ( let k = 0 ; k <= lines.length - 1 ; k ++ ) {
      let steps = lines[k].split('');
      for ( let l = 0 ; l <= steps.length - 1 ; l ++ ) {
        let stepInx = matrix[0].findIndex( ( a ) => a == steps[l] );
        for ( let m = 0 ; m <= steps.length - 1 ; m ++ ) {
          if ( l != m ) {
            let inx = matrix[0].findIndex( ( a ) => a == steps[m] );
            matrix[stepInx][inx] = '-';
            matrix[inx][stepInx] = '-';
          }
        }
      }
    }
    resolve( matrix )
  })
}

function getChar( v ) { return String.fromCharCode(v) }

(async () => {
  let url = process.argv[2];
  let buffer = fs.readFileSync( url ).toString('utf8'); 
  var matrix = await buildMatrix(buffer.split('\n'));
  const csv = matrix.map((a) => a.join(';') );

  fs.writeFile("./out.csv", csv.join("\r\n"), (err) => {
    console.log(err || "CSV Generado Correctamente!");
  }); 

})();