const Listing = require("../models/listing");

module.exports.index = async (req , res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , { allListings });
    }

    module.exports.renderNewForm = (req, res) => {
        res.render("./listings/new.ejs");
    }

    module.exports.showListings = async(req , res) => {
        let {id} = req.params;
        let listing = await Listing.findById(id)
        .populate({
        path :"reviews",
        populate :{path : "author",
          },
        })
        .populate("owner");
        if(!listing)
            {
                req.flash("error","Listing you requested for does not exist");
                res.redirect("/listings");
            }
        res.render("./listings/show.ejs",{ listing });
    }

    module.exports.createListing = async (req, res, next) => {        
        const newListing =new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");   
    }

    module.exports.renderEditForm = async (req, res) => {
        let {id} = req.params;
        let listing = await Listing.findById(id);
        res.render("./listings/edit.ejs", {listing});
    }

    module.exports.updateListing = async (req, res) => {
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        req.flash("success","Listing updated");
        res.redirect(`/listings/${id}`);
    }

    module.exports.destroyListing = async (req,res) => {
        let {id} = req.params;
        let deleted=await Listing.findByIdAndDelete(id);
        console.log(deleted);
        req.flash("success","Listing deleted");
        res.redirect("/listings");
    }