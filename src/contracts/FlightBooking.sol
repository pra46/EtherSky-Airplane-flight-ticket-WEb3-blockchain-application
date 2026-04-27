// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlightBooking {
    address public owner;
    uint256 public totalBookings;

    struct Booking {
        uint256 id;
        address user;
        uint256 flightId;
        uint256 price;
        uint256 timestamp;
        uint256 seatCount;
        bool exists;
    }

    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) public userBookings;

    event FlightBooked(
        uint256 indexed bookingId,
        address indexed user,
        uint256 flightId,
        uint256 price,
        uint256 timestamp
    );

    event BookingCancelled(uint256 indexed bookingId, address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function bookFlight(uint256 _flightId, uint256 _seatCount) public payable {
        require(msg.value > 0, "Price must be greater than zero");
        require(_seatCount > 0, "Must book at least one seat");

        totalBookings++;
        uint256 bookingId = totalBookings;

        bookings[bookingId] = Booking({
            id: bookingId,
            user: msg.sender,
            flightId: _flightId,
            price: msg.value,
            timestamp: block.timestamp,
            seatCount: _seatCount,
            exists: true
        });

        userBookings[msg.sender].push(bookingId);

        emit FlightBooked(bookingId, msg.sender, _flightId, msg.value, block.timestamp);
    }

    function getUserBookings(address _user) public view returns (uint256[] memory) {
        return userBookings[_user];
    }

    function getBookingDetails(uint256 _bookingId) public view returns (Booking memory) {
        require(bookings[_bookingId].exists, "Booking does not exist");
        return bookings[_bookingId];
    }

    function cancelBooking(uint256 _bookingId) public {
        require(bookings[_bookingId].exists, "Booking does not exist");
        require(bookings[_bookingId].user == msg.sender, "Not your booking");

        Booking storage booking = bookings[_bookingId];
        uint256 refundAmount = booking.price;
        
        booking.exists = false;
        
        // Refund ETH to the user
        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");
        
        emit BookingCancelled(_bookingId, msg.sender);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }

    receive() external payable {}
}
