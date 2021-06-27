import React, { useState, useEffect } from "react"
import "./Table.css"

const Table = () => {
  const [tableData, setTableData] = useState([])
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [isImageLoading, setIsImageLoading] = useState(0)

  useEffect(() => {
    if (!image) {
      setPreview(undefined)
      return
    }

    const objectUrl =
      image !== process.env.PUBLIC_URL + "/api/example_image"
        ? URL.createObjectURL(image)
        : process.env.PUBLIC_URL + "/api/example_image"

    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

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
    setImage(process.env.PUBLIC_URL + "/api/example_image")
    setPreview(process.env.PUBLIC_URL + "/api/example_image")
  }

  async function upload_image() {
    if (preview) {
      setIsImageLoading(1)
      const formData = new FormData()
      if (image === process.env.PUBLIC_URL + "/api/example_image") {
        const res = await fetch(process.env.PUBLIC_URL + "/api/example_image")
        const res2 = await res.blob()
        await formData.append("file", res2)
        await fetch("/api/image_upload", {
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
        fetch("/api/image_upload", {
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

  return (
    <div className="upload-component">
      <div className="info-container">
        <p className="upload-p">
          The 'Upload' button below sends the image your upload below to the
          REST server, which processes the image through it's OCR engine and
          returns the extracted table
        </p>
        <button className="upload-button" onClick={upload_image}>
          Upload
        </button>
        <input id="profilePic" type="file" onChange={getData} />
        <button className="upload-button" onClick={loadExample}>
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
                    let bkg = "#ffff66"
                    if (data[1] > 80) {
                      bkg = "#90EE90"
                    } else if (data[1] > 0) {
                      bkg = "#FFB6C1"
                    }
                    return (
                      <input
                        className="table-in"
                        style={{
                          width: `calc(100% / ${row.length + 1})`,
                          background: bkg,
                        }}
                        key={ind}
                        onChange={(e) => entryChange(i, ind, e)}
                        defaultValue={data[0]}
                      />
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
      <p>Contact tyler.lott@ngc.com for questions</p>
    </div>
  )
}

export default Table
