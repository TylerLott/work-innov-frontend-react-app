import React, { useState, useEffect } from "react"
import "./Table.css"

const Table = () => {
  const [tableData, setTableData] = useState([])
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [isImageLoading, setIsImageLoading] = useState(0)
  const exURL = process.env.PUBLIC_URL + "/api/example_image"
  const uploadURL = process.env.PUBLIC_URL + "/api/image_upload"

  useEffect(() => {
    if (!image) {
      setPreview(undefined)
      return
    }

    const objectUrl = image !== exURL ? URL.createObjectURL(image) : exURL

    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [image, exURL])

  const getData = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setPreview(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const loadExample = () => {
    setImage(exURL)
    setPreview(exURL)
  }

  async function upload_image() {
    if (preview) {
      setIsImageLoading(1)
      setTableData([])
      const formData = new FormData()
      if (image === exURL) {
        const res = await fetch(exURL)
        const res2 = await res.blob()
        await formData.append("file", res2)
        await fetch(uploadURL, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setIsImageLoading(0)
            setTableData(data)
            console.log(data)
          })
      } else {
        formData.append("file", image)
        fetch(uploadURL, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setIsImageLoading(0)
            setTableData(data)
          })
      }
    }
  }

  const entryChange = (i, j, e) => {
    let temp = [...tableData]
    temp[i][j] = [e.target.value, -1]
    setTableData(temp)
    console.log(tableData)
  }

  const copyTable = () => {
    let copy_table = ""
    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].length; j++) {
        copy_table += tableData[i][j][0] + "\t"
      }
      copy_table += "\n"
    }
    console.log(copy_table)
    navigator.clipboard.writeText(copy_table)
  }

  return (
    <div className="upload-component">
      <div className="info-container">
        <p className="upload-p">
          The 'Upload' button below sends the image your upload below to the
          REST server, which processes the image through it's OCR engine and
          returns the extracted table.
        </p>
        <p className="upload-p">
          (The example image takes around 30 seconds to process)
        </p>
        <button className="upload-button" onClick={upload_image}>
          Upload
        </button>
        <input id="profilePic" type="file" onChange={getData} />
        <button className="example-button" onClick={loadExample}>
          Load Example Image
        </button>
        <h1>IMAGE STAGED FOR UPLOAD:</h1>
      </div>

      <div className="user-image-container">
        {image && <img className="user-image" src={preview} alt="user_img" />}
      </div>
      <h1>EXTRACTED TABLE:</h1>
      {isImageLoading ? (
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <></>
      )}
      <table className="user-table">
        <tbody className="user-table">
          {!isImageLoading ? (
            tableData.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((data, ind) => {
                    const goodCellThresh = 80
                    let bkg = "#ffff66" //yellow for changed cells
                    if (parseInt(data[1]) > goodCellThresh) {
                      bkg = "#90EE90" //green for sure cells
                    } else if (parseInt(data[1]) >= 0) {
                      bkg = "#FFB6C1" //red for unsure cells
                    } else if (parseInt(data[1]) === -2) {
                      bkg = "#ADD8E6" //blue for empty cells (-2 is returned from server if it thinks cell is empty)
                    }

                    return (
                      <td>
                        <input
                          className="table-in"
                          style={{
                            width: `calc(90vw / ${row.length + 1})`,
                            background: bkg,
                          }}
                          key={ind}
                          onInput={(e) => entryChange(i, ind, e)}
                          defaultValue={data[0]}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
      {!isImageLoading ? (
        <button onClick={copyTable}>Copy Table</button>
      ) : (
        <></>
      )}
      <p>Contact tyler.lott@ngc.com for questions</p>
    </div>
  )
}

export default Table
